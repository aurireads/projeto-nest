import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0.01)
  price!: number;

  @IsString()
  @IsNotEmpty()
  sku!: string;
}
