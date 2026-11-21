import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { CustomersModule } from './customers/customers.module';
import { PurchasesModule } from './purchases/purchases.module';
import { DashboardModule } from './dashboard/dashboard.module';
@Module({ imports:[PrismaModule,AuthModule,NotesModule,CustomersModule,PurchasesModule,DashboardModule],controllers:[HealthController] })
export class AppModule {}
