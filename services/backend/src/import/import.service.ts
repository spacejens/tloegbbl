import { Injectable } from '@nestjs/common';
import { IdentifiablePersistenceService } from '../persistence/identifiable-persistence.service';
import { CombineDataService } from './combine-data.service';
import { Identifiable } from '@tloegbbl/api';

@Injectable()
export abstract class ImportService<R extends Identifiable, E extends R> {
  constructor(
    readonly persistenceService: IdentifiablePersistenceService<R, E>,
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
