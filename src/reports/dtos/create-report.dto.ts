import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  manufacturer: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1950)
  @Max(2050)
  year: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsNotEmpty()
  @IsLongitude()
  lon: number;

  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100000000)
  price: number;
}
