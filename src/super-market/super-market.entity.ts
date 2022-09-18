/* eslint-disable prettier/prettier */
import { CityEntity } from '../city/city.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SuperMarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  long: string;

  @Column()
  lati: string;

  @Column()
  webPage: string;

  @ManyToMany(() => CityEntity, (city) => city.markets)
  @JoinTable()
  cities: CityEntity[];
}
