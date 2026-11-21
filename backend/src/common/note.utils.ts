import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const PHONE_PATTERN = /^\d{8,15}$/;

export function normalizePhone(phone: string): string {
  const digits = phone.trim().replace(/[\s()+-]/g, '');
  if (!PHONE_PATTERN.test(digits)) throw new BadRequestException('رقم الهاتف غير صالح: أرسل مفتاح الدولة مع الرقم (8–15 رقمًا)');
  return digits;
}

export function normalizeNoteIds(ids: string[]): string[] {
  const unique = Array.from(new Set(ids));
  if (unique.length !== ids.length) throw new BadRequestException('لا يمكن تكرار النوتة');
  return unique;
}

export async function ensureNotesExist(prisma: PrismaService, ids: string[]) {
  if (!ids.length) return;
  const count = await prisma.fragranceNote.count({ where: { id: { in: ids } } });
  if (count !== ids.length) throw new BadRequestException('توجد نوتة عطرية غير معروفة');
}

export function parsePurchaseDate(value: string): Date {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value)
    throw new BadRequestException('تاريخ الشراء غير صالح');
  return parsed;
}
