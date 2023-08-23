import { Test, TestingModule } from '@nestjs/testing';
import { PersistenceService } from '../persistence/persistence.service';
import { ImportService } from './import.service';
import { Injectable } from '@nestjs/common';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { ExternallyIdentifiable } from '../dtos';

class TestReference extends ExternallyIdentifiable {}

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
  create(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
  update(): Promise<TestEntity> {
    throw new Error('Method not implemented.');
  }
}

@Injectable()
class TestImportService extends ImportService<TestReference, TestEntity> {
  constructor(
    readonly persistenceService: TestPersistenceService,
    readonly combineDataService: CombineDataService,
  ) {
    super(persistenceService, combineDataService);
  }
}

describe('ImportService', () => {
  let importService: TestImportService;
  let persistenceService: TestPersistenceService;
  let combineDataService: CombineDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestImportService,
        {
          provide: TestPersistenceService,
          useValue: mock<TestPersistenceService>(),
        },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    importService = module.get<TestImportService>(TestImportService);
    persistenceService = module.get<TestPersistenceService>(
      TestPersistenceService,
    );
    combineDataService = module.get<CombineDataService>(CombineDataService);
  });

  it('should be defined', () => {
    expect(importService).toBeDefined();
  });

  describe('import', () => {
    it('should create a new instance if not found', async () => {
      persistenceService.create = jest
        .fn()
        .mockImplementation((input: TestEntity) => ({
          ...input,
          id: 47,
        }));
      const result = await importService.import({
        name: 'New Instance',
      });
      expect(result).toStrictEqual({
        id: 47,
        name: 'New Instance',
      });
    });

    // TODO Both test cases should verify what the other service methods were called with

    it('should update existing instance if found', async () => {
      persistenceService.findByReference = jest.fn().mockImplementation(() => ({
        id: 31,
        name: 'Found',
      }));
      combineDataService.preferFound = jest.fn().mockImplementation(
        (requested: TestEntity, found: TestEntity): TestEntity => ({
          ...requested,
          ...found,
          name: requested.name + ' ' + found.name,
        }),
      );
      persistenceService.update = jest.fn().mockImplementation(
        (input: TestEntity): TestEntity => ({
          ...input,
          name: input.name + ' Updated',
        }),
      );
      const result = await importService.import({
        name: 'Requested',
      });
      expect(result).toStrictEqual({
        id: 31,
        name: 'Requested Found Updated',
      });
    });
  });
});
