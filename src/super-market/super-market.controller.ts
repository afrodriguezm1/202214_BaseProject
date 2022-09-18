import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SuperMarketDto } from './super-market.dto';
import { SuperMarketEntity } from './super-market.entity';
import { SuperMarketService } from './super-market.service';

@Controller('supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class SuperMarketController {
  constructor(private readonly superMarketService: SuperMarketService) {}
  @Get()
  async findAll() {
    return await this.superMarketService.findAll();
  }

  @Get(':superMarketId')
  async finOne(@Param('superMarketId') superMarketId: string) {
    return await this.superMarketService.findOne(superMarketId);
  }

  @Post()
  async create(@Body() superMarketDto: SuperMarketDto) {
    const superMarket: SuperMarketEntity = plainToInstance(
      SuperMarketEntity,
      superMarketDto,
    );
    return await this.superMarketService.create(superMarket);
  }

  @Put(':superMarketId')
  async update(
    @Param('superMarketId') superMarketId: string,
    @Body() superMarketDto: SuperMarketDto,
  ) {
    const superMarket: SuperMarketEntity = plainToInstance(
      SuperMarketEntity,
      superMarketDto,
    );
    return await this.superMarketService.update(superMarketId, superMarket);
  }

  @Delete(':superMarketId')
  @HttpCode(204)
  async delete(@Param('superMarketId') superMarketId: string) {
    return await this.superMarketService.delete(superMarketId);
  }
}
