import { Test, TestingModule } from '@nestjs/testing';
import { CityEntity } from '../city/city.entity';
import { SuperMarketEntity } from '../super-market/super-market.entity';
import { Repository } from 'typeorm';
import { CityMarketService } from './city-market.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CityMarketService', () => {
  let service: CityMarketService;
  let cityRepository: Repository<CityEntity>;
  let superMarketRepository: Repository<SuperMarketEntity>;
  let city: CityEntity;
  let superMarketList: SuperMarketEntity[];
  const cityNotFoundMessage: string =
    'La ciudad con el id dado no fue encontrado';

  const marketNotFoundMessage: string =
    'El Super Mercado con el id dado no fue encontrado';

  const associationNotFoundMessage: string =
    'El supermercado no tiene una asociación con la ciudad dada';

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [CityMarketService],
      }).compile();
  
      service = module.get<CityMarketService>(CityMarketService);
      cityRepository = module.get<Repository<CityEntity>>(
        getRepositoryToken(CityEntity),
      );
      superMarketRepository = module.get<Repository<SuperMarketEntity>>(
        getRepositoryToken(SuperMarketEntity),
      );
  
      await seedDatabase();
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

  const seedDatabase = async () => {
    await superMarketRepository.clear();
    await cityRepository.clear();

    superMarketList = [];

    for (let i = 0; i < 5; i++) {
      const superMarket: SuperMarketEntity = await superMarketRepository.save({
        name: 'Supermercado Ara',
        long: faker.address.longitude(),
        lati: faker.address.latitude(),
        webPage: faker.internet.url(),
        cities: [],
      });
      superMarketList.push(superMarket);
    }

    city = await cityRepository.save({
      name: faker.address.city(),
      country: 'Argentina',
      numHabitants: Math.floor(Math.random() * 1000),
      markets: superMarketList,
    });
  };
});
