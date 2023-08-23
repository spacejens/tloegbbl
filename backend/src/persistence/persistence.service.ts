import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PersistenceService<R, E extends R> {
  abstract findByReference(reference: R): Promise<E>;

  abstract create(input: E): Promise<E>;

  abstract update(input: E): Promise<E>;
}
