import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from '../city/city.entity';
import { SuperMarketEntity } from '../super-market/super-market.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CityMarketService {
  private readonly cityNotFoundMessage: string =
    'La ciudad con el id dado no fue encontrado';

  private readonly marketNotFoundMessage: string =
    'El Super Mercado con el id dado no fue encontrado';

  private readonly associationNotFoundMessage: string =
    'El supermercado no tiene una asociación con la ciudad dada';

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,

    @InjectRepository(SuperMarketEntity)
    private readonly superMarketRepository: Repository<SuperMarketEntity>,
  ) {}

  async addSupermarketToCity(
    cityId: string,
    superMarketId: string,
  ): Promise<CityEntity> {
    const [superMarket, city] = await Promise.all([
      this.superMarketRepository.findOne({
        where: { id: superMarketId },
      }),
      this.cityRepository.findOne({
        where: { id: cityId },
        relations: ['markets'],
      }),
    ]);
    if (!superMarket)
      throw new BusinessLogicException(
        this.marketNotFoundMessage,
        BusinessError.NOT_FOUND,
      );
    if (!city)
      throw new BusinessLogicException(
        this.cityNotFoundMessage,
        BusinessError.NOT_FOUND,
      );

    city.markets.push(superMarket);
    return await this.cityRepository.save(city);
  }

  async findSupermarketsFromCity(cityId: string): Promise<SuperMarketEntity[]> {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['markets'],
    });
    if (!city)
      throw new BusinessLogicException(
        this.cityNotFoundMessage,
        BusinessError.NOT_FOUND,
      );
    return city.markets;
  }

  async findSupermarketFromCity(
    cityId: string,
    superMarketId: string,
  ): Promise<SuperMarketEntity> {
    const [superMarket, city] = await Promise.all([
      this.superMarketRepository.findOne({
        where: { id: superMarketId },
      }),
      this.cityRepository.findOne({
        where: { id: cityId },
        relations: ['markets'],
      }),
    ]);
    if (!superMarket)
      throw new BusinessLogicException(
        this.marketNotFoundMessage,
        BusinessError.NOT_FOUND,
      );
    if (!city)
      throw new BusinessLogicException(
        this.cityNotFoundMessage,
        BusinessError.NOT_FOUND,
      );

    const citySuperMarket: SuperMarketEntity = city.markets.find(
      ({ id }) => superMarket.id === id,
    );

    if (!citySuperMarket)
      throw new BusinessLogicException(
        this.associationNotFoundMessage,
        BusinessError.PRECONDITION_FAILED,
      );

    return citySuperMarket;
  }

  async deleteSupermarketFromCity(cityId: string, superMarketId: string) {
    const [superMarket, city] = await Promise.all([
      this.superMarketRepository.findOne({
        where: { id: superMarketId },
      }),
      this.cityRepository.findOne({
        where: { id: cityId },
        relations: ['markets'],
      }),
    ]);
    if (!superMarket)
      throw new BusinessLogicException(
        this.marketNotFoundMessage,
        BusinessError.NOT_FOUND,
      );
    if (!city)
      throw new BusinessLogicException(
        this.cityNotFoundMessage,
        BusinessError.NOT_FOUND,
      );

    const superMarketCity: SuperMarketEntity = city.markets.find(
      ({ id }) => id === superMarket.id,
    );

    if (!superMarketCity)
      throw new BusinessLogicException(
        this.associationNotFoundMessage,
        BusinessError.PRECONDITION_FAILED,
      );

    city.markets = city.markets.filter(
      ({ id }) => id !== superMarketCity.id,
    );
    await this.cityRepository.save(city);
  }
}
