import { IsNotEmpty, IsString } from "class-validator";

export class CityDto {

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @IsString()
  @IsNotEmpty()
  readonly numHabitants: number;

}
