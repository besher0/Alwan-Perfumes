import { ArrayMinSize, ArrayUnique, IsArray, IsInt, IsOptional, IsString, IsUUID, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreatePurchaseDto {
  @IsUUID() customerId!: string;
  @IsString() @MinLength(2) @MaxLength(120) perfumeName!: string;
  @Matches(/^\d{4}-\d{2}-\d{2}$/) purchasedAt!: string;
  @IsInt() @Min(1) @Max(5) rating!: number;
  @IsString() primaryNoteId!: string;
  @IsArray() @ArrayMinSize(1) @ArrayUnique() @IsString({each:true}) noteIds!: string[];
  // If omitted, do not replace the customer's existing preferences.
  @IsOptional() @IsArray() @ArrayUnique() @IsString({each:true}) favoriteNoteIds?: string[];
}
