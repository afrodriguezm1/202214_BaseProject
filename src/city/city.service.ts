import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CityEntity } from './city.entity';

@Injectable()
export class CityService {
  private readonly notFoundMessage: string =
    'La ciudad con el id dado no fue encontrado';
  private readonly countryNotValidMessage: string =
    'El pais que ingresó no es válido';

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  async findAll(): Promise<CityEntity[]> {
    return await this.cityRepository.find();
  }

  async findOne(id: string): Promise<CityEntity> {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id },
      relations: ['markets']
    });
    if (!city) {
      throw new BusinessLogicException(
        this.notFoundMessage,
        BusinessError.NOT_FOUND,
      );
    }
    return city;
  }

  async findOneV2(id: string): Promise<CityEntity> {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id },
      relations: ['markets']
    });
    if (!city) {
      throw new BusinessLogicException(
        this.notFoundMessage,
        BusinessError.NOT_FOUND,
      );
    }
    return city;
  }

  async create(city: CityEntity): Promise<CityEntity> {
    if (
      !['argentina', 'ecuador', 'paraguay'].includes(city.country.toLowerCase())
    ) {
      throw new BusinessLogicException(
        this.countryNotValidMessage,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.cityRepository.save(city);
  }

  async createV2(city: CityEntity): Promise<CityEntity> {
    if (
      !['argentina', 'ecuador', 'paraguay'].includes(city.country.toLowerCase())
    ) {
      throw new BusinessLogicException(
        this.countryNotValidMessage,
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.cityRepository.save(city);
  }

  async update(id: string, city: CityEntity): Promise<CityEntity> {
    const dbCity: CityEntity = await this.cityRepository.findOne({
      where: { id },
    });
    if (!dbCity) {
      throw new BusinessLogicException(
        this.notFoundMessage,
        BusinessError.NOT_FOUND,
      );
    }
    if (
      !['argentina', 'ecuador', 'paraguay'].includes(city.country.toLowerCase())
    ) {
      throw new BusinessLogicException(
        this.countryNotValidMessage,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.cityRepository.save({ ...dbCity, ...city });
  }

  async delete(id: string) {
    const city: CityEntity = await this.cityRepository.findOne({
      where: { id },
    });
    if (!city) {
      throw new BusinessLogicException(
        this.notFoundMessage,
        BusinessError.NOT_FOUND,
      );
    }
    await this.cityRepository.remove(city);
  }
}
