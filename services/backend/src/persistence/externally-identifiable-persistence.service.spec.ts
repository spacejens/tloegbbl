import { Injectable } from '@nestjs/common';
import { ExternallyIdentifiablePersistenceService } from './externally-identifiable-persistence.service';
import { ExternallyIdentifiable } from '@tloegbbl/api';

class TestReference extends ExternallyIdentifiable {}

class TestEntity extends TestReference {
  name: string;
}

@Injectable()
class TestPersistenceService extends ExternallyIdentifiablePersistenceService<
  TestReference,
  TestEntity
> {
  findById(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
  findByExternalId(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
  create(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
  update(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
}

describe('ExternallyIdentifiablePersistenceService', () => {
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

  // TODO Implement test cases
});
