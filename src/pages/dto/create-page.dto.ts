import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreatePageDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsObject()
  content?: any;

  @IsNumber()
  pageNumber: number;

  @IsString()
  notebookId: string;
}
