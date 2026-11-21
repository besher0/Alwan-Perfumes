import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OwnerGuard } from '../auth/auth.guard';
import { purchaseOutput } from '../common/serialize';

@UseGuards(OwnerGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private db:PrismaService){}
  @Get()
  async overview(){
    const [customersCount,purchasesCount,rating,recentPurchases] = await Promise.all([
      this.db.customer.count(),this.db.purchase.count(),
      this.db.purchase.aggregate({_avg:{rating:true}}),
      this.db.purchase.findMany({orderBy:[{purchasedAt:'desc'},{createdAt:'desc'}],take:6,include:{notes:true,customer:{select:{id:true,name:true,phone:true}}}})
    ]);
    return {customersCount,purchasesCount,averageRating:rating._avg.rating?Math.round(rating._avg.rating*10)/10:0,recentPurchases:recentPurchases.map(purchaseOutput)};
  }
}
