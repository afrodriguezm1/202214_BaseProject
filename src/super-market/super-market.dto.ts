import { IsNotEmpty, IsString } from 'class-validator';

export class SuperMarketDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  long: string;

  @IsString()
  @IsNotEmpty()
  lati: string;

  @IsString()
  @IsNotEmpty()
  webPage: string;
}
