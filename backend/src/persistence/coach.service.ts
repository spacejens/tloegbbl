import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class CoachService {
  constructor(private prisma: PrismaService) {}

  async countCoaches(): Promise<number> {
    return this.prisma.coach.count();
  }
}
