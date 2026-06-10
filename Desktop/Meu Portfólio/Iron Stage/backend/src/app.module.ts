import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CommissionModule } from './commission/commission.module';
import { AccessControlModule } from './access-control/access-control.module';
import { AuthModule } from './auth/auth.module';
import { BandsModule } from './bands/bands.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ContentModule } from './content/content.module';
import { LiveShowsModule } from './live-shows/live-shows.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { PaymentsModule } from './payments/payments.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommissionModule,
    AccessControlModule,
    AuthModule,
    BandsModule,
    SubscriptionsModule,
    ContentModule,
    LiveShowsModule,
    MarketplaceModule,
    PaymentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
