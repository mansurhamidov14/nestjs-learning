import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewBookmarkDto, UpdateBookmarkDto } from './bookmark.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  createBookmark(userId: number, dto: NewBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        title: dto.title,
        description: dto.description || null,
        userId,
        link: dto.link,
        updatedAt: new Date()
      }
    });
  }

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId
      }
    })
  }

  async deleteBookmark(id: number, userId: number) {
    try {
      const deleted = await this.prisma.bookmark.delete({
        where: { id, userId }
      });

      return deleted;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(undefined, 'Bookmark not found')
      }
      throw e;
    } 
  }

  async updateBookmark(id: number, userId: number, dto: UpdateBookmarkDto) {
    try {
      const updated = await this.prisma.bookmark.update({
        where: { id, userId},
        data: {
          ...dto,
          updatedAt: new Date()
        }
      });
      return updated;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(undefined, 'Bookmark not found')
      }
      throw e;
    }
  }
}
