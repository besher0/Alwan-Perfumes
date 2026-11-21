import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {calculateNoteStats} from './note-stats';

@Injectable()
export class AnalyticsService {
  constructor(private db: PrismaService) {}
  async customer(id: string) {
    const customer = await this.db.customer.findUnique({where:{id},include:{favoriteNotes:true}});
    if (!customer) throw new NotFoundException('العميل غير موجود');
    const [notes, purchases] = await Promise.all([
      this.db.fragranceNote.findMany({orderBy:{sortOrder:'asc'}}),
      this.db.purchase.findMany({where:{customerId:id},include:{notes:true},orderBy:{purchasedAt:'desc'}}),
    ]);
    const rows = calculateNoteStats(purchases, notes);
    return {
      customerId: id, purchaseCount: purchases.length,
      averageRating: purchases.length ? Math.round(purchases.reduce((s,p)=>s+p.rating,0)/purchases.length*10)/10: 0,
      favoriteNoteIds: customer.favoriteNotes.map(f=>f.noteId),
      mostLiked: [...rows].sort((a,b)=>b.avgRating-a.avgRating||b.count-a.count||a.name.localeCompare(b.name,'ar')),
      mostPurchased: [...rows].sort((a,b)=>b.count-a.count||b.avgRating-a.avgRating||a.name.localeCompare(b.name,'ar')),
    };
  }
}
