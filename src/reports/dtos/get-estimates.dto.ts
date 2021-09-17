import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDto {
  @IsNotEmpty()
  @IsString()
  manufacturer: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(1950)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsLongitude()
  lon: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsLatitude()
  lat: number;
}
