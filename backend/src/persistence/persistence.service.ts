import { Injectable } from '@nestjs/common';

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

  abstract findByReference(reference: R): Promise<E>;

  abstract create(input: E): Promise<E>;

  abstract update(input: E): Promise<E>;
}
