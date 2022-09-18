import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';

@Module({
  providers: [CityService],
  imports: [TypeOrmModule.forFeature([CityEntity])],
  controllers: [CityController],
})
export class CityModule {}
