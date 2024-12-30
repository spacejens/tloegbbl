import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Trophy, TrophyCategory } from '../dtos';

@Injectable()
export class TrophyPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata): Trophy {
    return {
      ...value,
      trophyCategory: TrophyCategory[value.trophyCategory],
    };
  }
}
