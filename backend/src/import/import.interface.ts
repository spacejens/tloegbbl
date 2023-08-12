export enum ImportRequestDirective {
  Whatever = 'Whatever', // TODO Remove this example directive when any real directive is added
  // TODO Add directive to represent historical data (that shouldn't overwrite existing data)
  // TODO Add directive for bulk importing (which should e.g. not trigger statistics calculation for each API call)
}

export class ImportRequestEnvelope<T> {
  directives?: ImportRequestDirective[];
  data: T;
}

export enum ImportResponseStatus {
  Inserted = 'Inserted',
  Updated = 'Updated',
  Failed = 'Failed', // ImportResponseEnvelope.data will be empty
}

// TODO Compare against standard envelope for e.g. failures, class here should cover both success and failure if possible
export class ImportResponseEnvelope<T> {
  status: ImportResponseStatus;
  data?: T;
}

export class ImportExternalId {
  id?: number;
  externalId: string;
  externalSystem: string;
}

export class ImportCoach {
  id?: number;
  externalIds?: ImportExternalId[];
  name: string;
}

// TODO Add type validation for everything, and apply the ValidationPipe to the app
