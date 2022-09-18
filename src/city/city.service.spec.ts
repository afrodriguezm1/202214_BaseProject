import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';
import { faker } from '@faker-js/faker';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;
  let citysList: CityEntity[];

  const notFoundMessage: string = 'La ciudad con el id dado no fue encontrado';
  const countryNotValidMessage: string = 'El pais que ingresó no es válido';

  function getRandomCountry(position: number): string {
    const countries: string[] = ['Argentina', 'Ecuador', 'Paraguay'];
    return countries[position];
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    citysList = [];
    for (let i = 0; i < 5; i++) {
      const city: CityEntity = await repository.save({
        name: faker.address.city(),
        country: getRandomCountry(Math.floor(Math.random() * 2)),
        numHabitants: Math.floor(Math.random() * 1000),
        markets: [],
      });
      citysList.push(city);
    }
  };

  it('findAll should return all citys', async () => {
    const citys: CityEntity[] = await service.findAll();
    expect(citys).toBeDefined();
    expect(citys).toHaveLength(citysList.length);
  });

  it('findOne should return a city', async () => {
    const storedCity: CityEntity = citysList[0];
    const city: CityEntity = await service.findOne(storedCity.id);
    expect(city).toBeDefined();
    expect(city.name).toEqual(storedCity.name);
    expect(city.country).toEqual(storedCity.country);
  });

  it('findOne should throw an exception', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      notFoundMessage,
    );
  });

  it('create should create a new city', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.address.city(),
      country: getRandomCountry(Math.floor(Math.random() * 2)),
      numHabitants: Math.floor(Math.random() * 1000),
      markets: [],
    };

    const newCity: CityEntity = await service.create(city);
    expect(newCity).not.toBeNull();

    const storedCity: CityEntity = await repository.findOne({
      where: { id: newCity.id },
    });

    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toBe(newCity.name);
    expect(storedCity.country).toBe(newCity.country);
    expect(storedCity.numHabitants).toBe(newCity.numHabitants);
  });

  it('create should show an exception', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.address.city(),
      country: 'Colombia',
      numHabitants: Math.floor(Math.random() * 1000),
      markets: [],
    };

    await expect(() => service.create(city)).rejects.toHaveProperty(
      'message',
      countryNotValidMessage,
    );
  });

  it('update should modify a city', async () => {
    const city: CityEntity = citysList[0];
    city.name = faker.address.city();
    city.country = 'Argentina';
    city.numHabitants = Math.floor(Math.random() * 1000);
    const updateCity: CityEntity = await service.update(city.id, city);

    expect(updateCity).toBeDefined();
    const storedCity: CityEntity = await repository.findOne({
      where: { id: city.id },
    });

    expect(storedCity).toBeDefined();
    expect(storedCity).toMatchObject({
      name: city.name,
    });
  });

  it('update should throw an exception, city not foun', async () => {
    let city: CityEntity = citysList[0];
    city.name = 'New name';
    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      notFoundMessage,
    );
  });

  it('update should throw an exception, city invalid precondition', async () => {
    let city: CityEntity = citysList[0];
    city.country = 'Colombia';
    await expect(() => service.update(city.id, city)).rejects.toHaveProperty(
      'message',
      countryNotValidMessage,
    );
  });

  it('remove should remove a city', async () => {
    const city: CityEntity = citysList[0];
    await service.delete(city.id);
    const deletedCity: CityEntity = await repository.findOne({
      where: { id: city.id },
    });
    expect(deletedCity).toBeNull();
  });

  it('remove should throw an exception', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      notFoundMessage,
    );
  });
});
