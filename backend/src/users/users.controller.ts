import {
  Controller,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/profile',
        filename: (_req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, uniqueName + ext);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only JPG/JPEG/PNG allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updatePicture(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('Aucune image envoyée');
    }

    const imageUrl = `/uploads/profile/${file.filename}`;

    await this.usersService.updateByEmail(req.user.email, {
      picture: imageUrl,
    });

    return {
      message: 'Photo de profil mise à jour',
      picture: imageUrl,
    };
  }
}
