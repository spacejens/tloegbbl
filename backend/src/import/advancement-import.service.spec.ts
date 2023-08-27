import { Test, TestingModule } from '@nestjs/testing';
import { AdvancementImportService } from './advancement-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { AdvancementService } from '../persistence/advancement.service';

describe('AdvancementImportService', () => {
  let service: AdvancementImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvancementImportService,
        { provide: AdvancementService, useValue: mock<AdvancementService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<AdvancementImportService>(AdvancementImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
