import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';

class StateDto {
  @IsString()
  @IsNotEmpty()
  label: string;
}

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  dane: string;

  @IsBoolean()
  status: boolean;

  @IsObject()
  @IsNotEmpty()
  state: StateDto;
}
