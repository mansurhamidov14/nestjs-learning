import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto, SignUpDto } from './auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async signIn(dto: AuthDto) {
    // find user with email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    });
    // if user does not exist throw an error
    if (!user) {
      throw new ForbiddenException('Incorrect credentials');
    }

    // if user exists we verifty password
    const passwordMatches = await argon.verify(user.hash, dto.password);

    // throw an error if password is incorrect
    if (!passwordMatches) {
      throw new ForbiddenException('Incorrect credentials')
    }

    const access_token = await this.signToken(user.id, user.email);

    return {
      user,
      access_token
    };
  }

  async signUp(dto: SignUpDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // save a new user to db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName || null,
          updatedAt: new Date()
        }
      });

      // return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('This email is already taken');
      }

      throw error;
    }
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET')
    });
  }
}
