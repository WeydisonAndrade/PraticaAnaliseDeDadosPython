import { Module } from '@nestjs/common';
import { LiveShowsService } from './live-shows.service';
import { LiveShowsController } from './live-shows.controller';
import { AccessControlModule } from '../access-control/access-control.module';
import { CommissionModule } from '../commission/commission.module';

@Module({
  imports: [AccessControlModule, CommissionModule],
  controllers: [LiveShowsController],
  providers: [LiveShowsService],
  exports: [LiveShowsService],
})
export class LiveShowsModule {}
