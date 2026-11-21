import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OwnerGuard } from '../auth/auth.guard';

@UseGuards(OwnerGuard)
@Controller('notes')
export class NotesController {
  constructor(private db: PrismaService) {}
  @Get() all() { return this.db.fragranceNote.findMany({ orderBy: { sortOrder: 'asc' } }); }
}
