import { Injectable } from '@nestjs/common';
import { Identifiable } from '@tloegbbl/api';

@Injectable()
export abstract class IdentifiablePersistenceService<
  R extends Identifiable,
  E extends R,
> {
  constructor(
    readonly prismaDelegate: {
      count: () => number | PromiseLike<number>;
    },
  ) {}

  // TODO Not sure that trying to duck-type Prisma delegates into the superclass is a good thing? Maybe just keep abstract methods here?
  async count(): Promise<number> {
    return this.prismaDelegate.count();
  }

  abstract findById(id: number): Promise<E>;

  fieldsNeededForTheDto() {
    // This will be overridden and expanded upon by those subclasses that need more
    return {};
  }

  abstract findByReference(reference: R): Promise<E>;

  abstract create(input: E): Promise<E>;

  abstract update(input: E): Promise<E>;
}
