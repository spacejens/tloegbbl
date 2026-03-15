import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import {
  MatchEvent,
  MatchEventActionType,
  MatchEventConsequenceType,
} from '@tloegbbl/api';

@Injectable()
export class MatchEventPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata): MatchEvent {
    return {
      ...value,
      actionType: MatchEventActionType[value.actionType],
      consequenceType: MatchEventConsequenceType[value.consequenceType],
    };
  }
}
