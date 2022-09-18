import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { SuperMarketEntity } from '../super-market/super-market.entity';
import { CityMarketService } from './city-market.service';
import { CityMarketController } from './city-market.controller';

@Module({
  providers: [CityMarketService],
  imports: [TypeOrmModule.forFeature([CityEntity, SuperMarketEntity])],
  controllers: [CityMarketController],
})
export class CityMarketModule {}
