import { Test, TestingModule } from '@nestjs/testing';
import { SuperMarketService } from './super-market.service';
import { SuperMarketEntity } from './super-market.entity';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SuperMarketService', () => {
  let service: SuperMarketService;
  let repository: Repository<SuperMarketEntity>;
  let superMarketsList: SuperMarketEntity[];

  const notFoundMessage: string =
    'El Super Mercado con el id dado no fue encontrado';
  const superMarketNameMessage: string =
    'El nombre dado no tiene más de 10 caracteres';

  function getRandomMarketNameLong(): string {
    const markets: string[] = [
      'Supermercado Olimpica',
      'Supermercado Ara',
      'Supermercado D1',
    ];
    return markets[Math.floor(Math.random() * 2)];
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SuperMarketService],
    }).compile();

    service = module.get<SuperMarketService>(SuperMarketService);
    repository = module.get<Repository<SuperMarketEntity>>(
      getRepositoryToken(SuperMarketEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    superMarketsList = [];
    for (let i = 0; i < 5; i++) {
      const market: SuperMarketEntity = await repository.save({
        name: getRandomMarketNameLong(),
        long: faker.address.longitude(),
        lati: faker.address.latitude(),
        webPage: faker.internet.url(),
        cities: [],
      });
      superMarketsList.push(market);
    }
  };

  it('findAll should return all superMarkets', async () => {
    const superMarkets: SuperMarketEntity[] = await service.findAll();
    expect(superMarkets).toBeDefined();
    expect(superMarkets).toHaveLength(superMarketsList.length);
  });

  it('findOne should return a superMarket', async () => {
    const storedSuperMarket: SuperMarketEntity = superMarketsList[0];
    const superMarket: SuperMarketEntity = await service.findOne(
      storedSuperMarket.id,
    );
    expect(superMarket).toBeDefined();
    expect(superMarket.name).toEqual(storedSuperMarket.name);
    expect(superMarket.long).toEqual(storedSuperMarket.long);
    expect(superMarket.lati).toEqual(storedSuperMarket.lati);
    expect(superMarket.webPage).toEqual(storedSuperMarket.webPage);
  });

  it('findOne should throw an exception', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      notFoundMessage,
    );
  });

  it('create should create a new superMarket', async () => {
    const superMarket: SuperMarketEntity = {
      id: '',
      name: getRandomMarketNameLong(),
      long: faker.address.longitude(),
      lati: faker.address.latitude(),
      webPage: faker.internet.url(),
      cities: [],
    };

    const newSuperMarket: SuperMarketEntity = await service.create(superMarket);
    expect(newSuperMarket).not.toBeNull();

    const storedSuperMarket: SuperMarketEntity = await repository.findOne({
      where: { id: newSuperMarket.id },
    });

    expect(storedSuperMarket).not.toBeNull();
    expect(storedSuperMarket.name).toBe(newSuperMarket.name);
    expect(storedSuperMarket.long).toEqual(newSuperMarket.long);
    expect(storedSuperMarket.lati).toEqual(newSuperMarket.lati);
    expect(storedSuperMarket.webPage).toEqual(newSuperMarket.webPage);
  });

  it('create should show an exception', async () => {
    const superMarket: SuperMarketEntity = {
      id: '',
      name: 'Ara',
      long: faker.address.longitude(),
      lati: faker.address.latitude(),
      webPage: faker.internet.url(),
      cities: [],
    };

    await expect(() => service.create(superMarket)).rejects.toHaveProperty(
      'message',
      superMarketNameMessage,
    );
  });

  it('update should modify a superMarket', async () => {
    const superMarket: SuperMarketEntity = superMarketsList[0];
    superMarket.name = getRandomMarketNameLong();
    superMarket.lati = faker.address.latitude();
    superMarket.long = faker.address.longitude();
    const updateSuperMarket: SuperMarketEntity = await service.update(
      superMarket.id,
      superMarket,
    );

    expect(updateSuperMarket).toBeDefined();
    const storedSuperMarket: SuperMarketEntity = await repository.findOne({
      where: { id: superMarket.id },
    });

    expect(storedSuperMarket).toBeDefined();
    expect(storedSuperMarket).toMatchObject({
      name: superMarket.name,
      long: superMarket.long,
      lati: superMarket.lati,
      webPage: superMarket.webPage,
    });
  });

  it('update should throw an exception, superMarket not foun', async () => {
    let superMarket: SuperMarketEntity = superMarketsList[0];
    superMarket.name = 'New name';
    await expect(() => service.update('0', superMarket)).rejects.toHaveProperty(
      'message',
      notFoundMessage,
    );
  });

  it('update should throw an exception, superMarket invalid precondition', async () => {
    let superMarket: SuperMarketEntity = superMarketsList[0];
    superMarket.name = 'Ara';
    await expect(() =>
      service.update(superMarket.id, superMarket),
    ).rejects.toHaveProperty('message', superMarketNameMessage);
  });

  it('remove should remove a superMarket', async () => {
    const superMarket: SuperMarketEntity = superMarketsList[0];
    await service.delete(superMarket.id);
    const deletedSuperMarket: SuperMarketEntity = await repository.findOne({
      where: { id: superMarket.id },
    });
    expect(deletedSuperMarket).toBeNull();
  });

  it('remove should throw an exception', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      notFoundMessage,
    );
  });
});
