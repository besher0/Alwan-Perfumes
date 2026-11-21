import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
@Module({imports:[AuthModule,AnalyticsModule],controllers:[CustomersController],providers:[CustomersService]})
export class CustomersModule {}
