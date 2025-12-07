import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        picture: true,
        role: true,
        isVerified: true,
      },
    });
  }

  async create(data: {
    email: string;
    password?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    picture?: string | null;
    googleId?: string | null;
    role?: string;
    otpCode?: string | null;
    otpExpiresAt?: Date | null;
    isVerified?: boolean;
    refreshToken?: string | null;
  }) {
    return this.prisma.user.create({ data });
  }

  async updateByEmail(email: string, data: any) {
    return this.prisma.user.update({
      where: { email },
      data,
    });
  }
}
