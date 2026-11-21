import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateCustomerDto } from './customers.dto';
import { ensureNotesExist, normalizePhone, normalizeNoteIds } from '../common/note.utils';
import { purchaseOutput } from '../common/serialize';

@Injectable()
export class CustomersService {
  constructor(private db: PrismaService, private analytics: AnalyticsService) {}

  async list(search?: string) {
    const q = search?.trim().slice(0, 100);
    const rows = await this.db.customer.findMany({
      where: q ? { OR: [{ name: {contains:q,mode:'insensitive'} },{phone:{contains:q.replace(/\D/g,'')}}] } : undefined,
      orderBy:{updatedAt:'desc'},
      include:{_count:{select:{purchases:true}},favoriteNotes:true},
    });
    return rows.map(c=>({id:c.id,name:c.name,phone:c.phone,createdAt:c.createdAt.toISOString(),purchaseCount:c._count.purchases,favoriteNoteIds:c.favoriteNotes.map(n=>n.noteId)}));
  }

  async one(id: string) {
    const row = await this.db.customer.findUnique({where:{id},include:{favoriteNotes:true,purchases:{orderBy:[{purchasedAt:'desc'},{createdAt:'desc'}],include:{notes:true,primaryNote:true}}}});
    if (!row) throw new NotFoundException('العميل غير موجود');
    return {id:row.id,name:row.name,phone:row.phone,createdAt:row.createdAt.toISOString(),favoriteNoteIds:row.favoriteNotes.map(f=>f.noteId),purchases:row.purchases.map(purchaseOutput)};
  }

  async create(dto: CreateCustomerDto) {
    const favoriteNoteIds = normalizeNoteIds(dto.favoriteNoteIds || []);
    await ensureNotesExist(this.db, favoriteNoteIds);
    try {
      const c = await this.db.customer.create({
        data: {name: dto.name.trim(),phone:normalizePhone(dto.phone),favoriteNotes:{create:favoriteNoteIds.map(noteId=>({noteId}))}}
      });
      return this.one(c.id);
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code==='P2002') throw new ConflictException('رقم الهاتف مسجل مسبقًا');
      throw e;
    }
  }

  async updateFavorites(id: string, noteIds: string[]) {
    const selected = normalizeNoteIds(noteIds);
    await ensureNotesExist(this.db, selected);
    if (!await this.db.customer.findUnique({where:{id},select:{id:true}})) throw new NotFoundException('العميل غير موجود');
    await this.db.$transaction(async tx=>{
      await tx.customerFavoriteNote.deleteMany({where:{customerId:id}});
      if(selected.length) await tx.customerFavoriteNote.createMany({data:selected.map(noteId=>({customerId:id,noteId}))});
    });
    return this.one(id);
  }

  async share(id: string) {
    const [customer, analytics, notes] = await Promise.all([this.one(id),this.analytics.customer(id),this.db.fragranceNote.findMany()]);
    const nameOf=(id:string)=>notes.find(n=>n.id===id)?.nameAr || id;
    const purchases = customer.purchases;
    const lines = [
      '🌸 علوان للعطور | ملخص مشترياتك',
      `العميل: ${customer.name}`,
      `عدد المشتريات: ${purchases.length}`,
      '',
      ...purchases.flatMap((p,i)=>[
        `${i+1}. ${p.perfumeName} — ${p.purchasedAt}`,
        `   التقييم: ${'⭐'.repeat(p.rating)} (${p.rating}/5)`,
        `   النوتات: ${p.noteIds.map(nameOf).join('، ')}`,
      ]),
      '',
      `النوتات التي تفضّلها: ${customer.favoriteNoteIds.map(nameOf).join('، ') || 'لم تُحدد بعد'}`,
      `الأعلى تقييمًا: ${analytics.mostLiked[0] ? `${analytics.mostLiked[0].name} (${analytics.mostLiked[0].avgRating}/5)` : 'لا توجد تقييمات'}`,
      `الأكثر شراءً: ${analytics.mostPurchased[0] ? `${analytics.mostPurchased[0].name} (${analytics.mostPurchased[0].count})` : 'لا توجد مشتريات'}`,
      '',
      'شكرًا لثقتك بعلوان للعطور 🌷'
    ];
    return {phone:customer.phone,message:lines.join('\n')};
  }
}
