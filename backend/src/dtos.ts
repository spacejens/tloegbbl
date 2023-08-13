export class ExternalId {
  id?: number;
  externalId: string;
  externalSystem: string;
}

export class CoachReference {
  id?: number;
  externalIds?: ExternalId[];
}

export class Coach extends CoachReference {
  name: string;
}
