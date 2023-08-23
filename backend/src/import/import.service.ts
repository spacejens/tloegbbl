import { Injectable } from '@nestjs/common';
import { PersistenceService } from '../persistence/persistence.service';
import { CombineDataService } from './combine-data.service';
import { ExternallyIdentifiable } from '../dtos';

@Injectable()
export abstract class ImportService<
  R extends ExternallyIdentifiable,
  E extends R,
> {
  constructor(
    readonly persistenceService: PersistenceService<R, E>,
    readonly combineDataService: CombineDataService,
  ) {}

  async import(requested: E): Promise<E> {
    const found: E = await this.persistenceService.findByReference(requested);
    if (found) {
      return await this.persistenceService.update(
        this.combineDataService.preferFound(requested, found),
      );
    } else {
      return await this.persistenceService.create(requested);
    }
  }
}
