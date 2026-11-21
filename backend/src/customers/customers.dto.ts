import { ArrayUnique, IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @IsString() @MinLength(8) @MaxLength(25) phone!: string;
  @IsOptional() @IsArray() @ArrayUnique() @IsString({each:true}) favoriteNoteIds?: string[];
}

export class UpdateFavoritesDto {
  @IsArray() @ArrayUnique() @IsString({each:true}) noteIds!: string[];
}
