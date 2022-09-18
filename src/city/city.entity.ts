/* eslint-disable prettier/prettier */
import { SuperMarketEntity } from '../super-market/super-market.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  numHabitants: number;

  @ManyToMany(() => SuperMarketEntity, (market) => market.cities)
  @JoinTable()
  markets: SuperMarketEntity[];
}
