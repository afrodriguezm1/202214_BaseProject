import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityMarketModule } from './city-market/city-market.module';
import { CityEntity } from './city/city.entity';
import { CityModule } from './city/city.module';
import { SuperMarketEntity } from './super-market/super-market.entity';
import { SuperMarketModule } from './super-market/super-market.module';


@Module({
  imports: [
    CityModule,
    SuperMarketModule,
    CityMarketModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial',
      entities: [CityEntity, SuperMarketEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
