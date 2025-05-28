import { IsArray, IsNumber } from 'class-validator';

export class UserInterestsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  interestIds: number[];
}