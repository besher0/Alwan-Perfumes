import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OwnerGuard } from '../auth/auth.guard';
import { CustomersService } from './customers.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateCustomerDto, UpdateFavoritesDto } from './customers.dto';

@UseGuards(OwnerGuard)
@Controller('customers')
export class CustomersController {
  constructor(private service:CustomersService,private analytics: AnalyticsService) {}
  @Get() list(@Query('search') search?:string){return this.service.list(search);}
  @Post() create(@Body() dto:CreateCustomerDto){return this.service.create(dto);}
  @Get(':id') one(@Param('id') id:string){return this.service.one(id);}
  @Patch(':id/favorites') favorites(@Param('id') id:string,@Body() dto:UpdateFavoritesDto){return this.service.updateFavorites(id,dto.noteIds);}
  @Get(':id/analytics') stats(@Param('id') id:string){return this.analytics.customer(id);}
  @Get(':id/share-summary') share(@Param('id') id:string){return this.service.share(id);}
}
