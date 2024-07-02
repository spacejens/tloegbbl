import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { MatchEvent, MatchEventActionType, MatchEventConsequenceType } from '../dtos';

@Injectable()
export class MatchEventPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): MatchEvent {
    return {
      ...value,
      actionType: MatchEventActionType[value.actionType],
      consequenceType: MatchEventConsequenceType[value.consequenceType],
    };
  }
}
