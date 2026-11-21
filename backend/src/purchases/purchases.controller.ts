import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OwnerGuard } from '../auth/auth.guard';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './purchases.dto';
@UseGuards(OwnerGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private service:PurchasesService){}
  @Get() list(@Query('customerId') customerId?:string){return this.service.list(customerId);}
  @Post() create(@Body() dto:CreatePurchaseDto){return this.service.create(dto);}
}
