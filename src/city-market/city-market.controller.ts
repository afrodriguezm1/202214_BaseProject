import { Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CityMarketService } from './city-market.service';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CityMarketController {

  constructor (private readonly cityMarketService: CityMarketService){}

  @Get(':cityId/supermarkets')
  async findSupermarketsFromCity(@Param('cityId') cityId: string){
    return await this.cityMarketService.findSupermarketsFromCity(cityId)
  }

  @Get(':cityId/supermarkets/:supermarketId')
  async findSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
    return await this.cityMarketService.findSupermarketFromCity(cityId, supermarketId)
  }

  @Post(':cityId/supermarkets/:supermarketId')
  async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
    return await this.cityMarketService.addSupermarketToCity(cityId, supermarketId);
  }

  @Delete(':cityId/supermarkets/:supermarketId')
  @HttpCode(204)
  async deleteSupermarketFromcity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
    return await this.cityMarketService.deleteSupermarketFromCity(cityId, supermarketId)
  }
}
