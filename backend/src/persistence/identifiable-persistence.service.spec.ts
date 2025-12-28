import { IdentifiablePersistenceService } from './identifiable-persistence.service';
import { Identifiable } from '@tloegbbl/api';
import { Injectable } from '@nestjs/common';

class TestReference extends Identifiable {}

class TestEntity extends TestReference {
  name: string;
}

@Injectable()
class TestPersistenceService extends IdentifiablePersistenceService<
  TestReference,
  TestEntity
> {
  findById(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
  findByReference(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
  create(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
  update(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
}

describe('IdentifiablePersistenceService', () => {
  let persistenceService: TestPersistenceService;
  const prismaDelegate = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    // Cannot use test module and inject dependencies here, since Prisma delegates don't have a shared type/interface/superclass
    persistenceService = new TestPersistenceService(prismaDelegate);
  });

  it('should be defined', () => {
    expect(persistenceService).toBeDefined();
  });

  describe('count', () => {
    it('should return the count', async () => {
      prismaDelegate.count = jest.fn().mockReturnValue(23);
      const result = await persistenceService.count();
      expect(result).toBe(23);
    });
  });

  // TODO Implement test cases
});
