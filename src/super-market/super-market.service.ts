import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { SuperMarketEntity } from './super-market.entity';

@Injectable()
export class SuperMarketService {
  private readonly notFoundMessage: string =
    'El Super Mercado con el id dado no fue encontrado';
  private readonly superMarketNameMessage: string =
    'El nombre dado no tiene más de 10 caracteres';

  constructor(
    @InjectRepository(SuperMarketEntity)
    private readonly superMarketRepository: Repository<SuperMarketEntity>,
  ) {}

  async findAll(): Promise<SuperMarketEntity[]> {
    return await this.superMarketRepository.find();
  }

  async findOne(id: string): Promise<SuperMarketEntity> {
    const superMarket: SuperMarketEntity =
      await this.superMarketRepository.findOne({
        where: { id },
        relations: ['cities'],
      });
    if (!superMarket) {
      throw new BusinessLogicException(
        this.notFoundMessage,
        BusinessError.NOT_FOUND,
      );
    }
    return superMarket;
  }

  async create(superMarket: SuperMarketEntity): Promise<SuperMarketEntity> {
    if (!(superMarket.name.length > 10)) {
      throw new BusinessLogicException(
        this.superMarketNameMessage,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.superMarketRepository.save(superMarket);
  }

  async update(
    id: string,
    superMarket: SuperMarketEntity,
  ): Promise<SuperMarketEntity> {
    const dbSuperMarket: SuperMarketEntity =
      await this.superMarketRepository.findOne({
        where: { id },
      });
    if (!dbSuperMarket) {
      throw new BusinessLogicException(
        this.notFoundMessage,
        BusinessError.NOT_FOUND,
      );
    }
    if (!(superMarket.name.length > 10)) {
      throw new BusinessLogicException(
        this.superMarketNameMessage,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.superMarketRepository.save({
      ...dbSuperMarket,
      ...superMarket,
    });
  }

  async delete(id: string) {
    const superMarket: SuperMarketEntity =
      await this.superMarketRepository.findOne({
        where: { id },
      });
    if (!superMarket) {
      throw new BusinessLogicException(
        this.notFoundMessage,
        BusinessError.NOT_FOUND,
      );
    }
    await this.superMarketRepository.remove(superMarket);
  }
}
