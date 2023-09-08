import { Test, TestingModule } from '@nestjs/testing';
import { MatchEventImportService } from './match-event-import.service';
import { CombineDataService } from './combine-data.service';
import { mock } from 'jest-mock-extended';
import { MatchEventService } from '../persistence/match-event.service';

describe('MatchEventImportService', () => {
  let service: MatchEventImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchEventImportService,
        { provide: MatchEventService, useValue: mock<MatchEventService>() },
        { provide: CombineDataService, useValue: mock<CombineDataService>() },
      ],
    }).compile();

    service = module.get<MatchEventImportService>(MatchEventImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
