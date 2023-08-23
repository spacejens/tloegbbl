import { Injectable } from '@nestjs/common';
import { PersistenceService } from 'src/persistence/persistence.service';
import { CombineDataService } from './combine-data.service';

@Injectable()
export abstract class ImportService<R, E extends R> {
  constructor(
    readonly persistenceService: PersistenceService<R, E>,
    readonly combineDataService: CombineDataService,
  ) {}

  abstract import(requested: E): Promise<E>;
}
