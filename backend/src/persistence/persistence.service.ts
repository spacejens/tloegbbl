import { Injectable } from '@nestjs/common';
import { ExternalId } from '../dtos';

@Injectable()
export abstract class PersistenceService<R, E extends R> {
  constructor(
    readonly prismaDelegate: {
      count: () => number | PromiseLike<number>;
    },
  ) {}

  async count(): Promise<number> {
    return this.prismaDelegate.count();
  }

  abstract findById(id: number): Promise<E>;

  abstract findByExternalId(externalId: ExternalId): Promise<E>;

  abstract findByReference(reference: R): Promise<E>;

  abstract create(input: E): Promise<E>;

  abstract update(input: E): Promise<E>;
}
