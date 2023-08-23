import { Injectable } from '@nestjs/common';
import { PersistenceService } from './persistence.service';
import { ExternalId } from 'src/dtos';

class TestReference {
  id?: number;
}

class TestEntity extends TestReference {
  name: string;
}

@Injectable()
class TestPersistenceService extends PersistenceService<
  TestReference,
  TestEntity
> {
  findById(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
  findByExternalId(): Promise<TestEntity> {
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

describe('PersistenceService', () => {
  let persistenceService: TestPersistenceService;
  const prismaDelegate = {
    count: jest.fn(),
  };

  beforeEach(async () => {
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
});
