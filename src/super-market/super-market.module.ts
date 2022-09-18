import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperMarketController } from './super-market.controller';
import { SuperMarketEntity } from './super-market.entity';
import { SuperMarketService } from './super-market.service';
@Module({
  providers: [SuperMarketService],
  imports: [TypeOrmModule.forFeature([SuperMarketEntity])],
  controllers: [SuperMarketController],
})
export class SuperMarketModule {}
