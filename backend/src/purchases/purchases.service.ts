import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ensureNotesExist, normalizeNoteIds, parsePurchaseDate } from '../common/note.utils';
import { purchaseOutput } from '../common/serialize';
import { CreatePurchaseDto } from './purchases.dto';

@Injectable()
export class PurchasesService {
  constructor(private db: PrismaService) {}
  async list(customerId?:string) {
    const rows = await this.db.purchase.findMany({
      where: customerId?{customerId}:undefined,
      orderBy:[{purchasedAt:'desc'},{createdAt:'desc'}],
      include:{notes:true,customer:{select:{id:true,name:true,phone:true}}},
    });
    return rows.map(purchaseOutput);
  }
  async create(dto:CreatePurchaseDto) {
    const notes = normalizeNoteIds(dto.noteIds);
    const favorites = dto.favoriteNoteIds===undefined ? undefined : normalizeNoteIds(dto.favoriteNoteIds);
    if (!notes.includes(dto.primaryNoteId)) throw new BadRequestException('يجب أن تكون النوتة الرئيسية ضمن نوتات العطر');
    await ensureNotesExist(this.db, Array.from(new Set([...notes,...(favorites||[])])));
    const date=parsePurchaseDate(dto.purchasedAt);
    const customer=await this.db.customer.findUnique({where:{id:dto.customerId},select:{id:true}});
    if(!customer) throw new NotFoundException('العميل غير موجود');

    const created = await this.db.$transaction(async tx=>{
      const purchase=await tx.purchase.create({data:{
        customerId:dto.customerId,perfumeName:dto.perfumeName.trim(),purchasedAt:date,
        rating:dto.rating,primaryNoteId:dto.primaryNoteId,
        notes:{create:notes.map(noteId=>({noteId}))},
      },include:{notes:true,customer:{select:{id:true,name:true,phone:true}}}});
      if(favorites!==undefined){
        await tx.customerFavoriteNote.deleteMany({where:{customerId:dto.customerId}});
        if(favorites.length) await tx.customerFavoriteNote.createMany({data:favorites.map(noteId=>({customerId:dto.customerId,noteId}))});
      }
      return purchase;
    });
    return purchaseOutput(created);
  }
}
