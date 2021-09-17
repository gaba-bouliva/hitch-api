import { Expose } from 'class-transformer';

export class ShowUserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
