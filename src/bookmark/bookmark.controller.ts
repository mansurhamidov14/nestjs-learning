import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { NewBookmarkDto, UpdateBookmarkDto } from './bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { User } from 'src/user/user.decorators';
import { JwtGuard } from 'src/auth/strategy';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post('new')
  async addBookmark(@Body() dto: NewBookmarkDto, @User('sub') userId: number) {
    return (await this.bookmarkService.createBookmark(userId, dto));
  }

  @Get("/")
  async getBookmarks(@User('sub') userId: number) {
    const bookmarks = await this.bookmarkService.getBookmarks(userId);

    return bookmarks;
  }

  @Delete(':id')
  async deleteBookmark(@Param('id') id: string, @User('sub') userId: number) {
    const deleted = await this.bookmarkService.deleteBookmark(Number(id), userId);

    return deleted;
  }

  @Patch(':id')
  async updateBookmark(@Param('id') id: string, @User('sub') userId: number, @Body() dto: UpdateBookmarkDto) {
    const updated = await this.bookmarkService.updateBookmark(Number(id), userId, dto);

    return updated;
  }
}
