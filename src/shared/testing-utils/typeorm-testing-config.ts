import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../../city/city.entity';
import { SuperMarketEntity } from '../../super-market/super-market.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [CityEntity, SuperMarketEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([CityEntity, SuperMarketEntity]),
];
