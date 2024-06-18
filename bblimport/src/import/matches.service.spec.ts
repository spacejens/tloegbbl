import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { ApiClientService } from '../api-client/api-client.service';
import { mock } from 'jest-mock-extended';
import { FileReaderService } from './filereader.service';
import { MatchEventConsolidatorService } from './match-event-consolidator.service';

describe('MatchesService', () => {
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: FileReaderService, useValue: mock<FileReaderService>() },
        { provide: ApiClientService, useValue: mock<ApiClientService>() },
        { provide: MatchEventConsolidatorService, useValue: mock<MatchEventConsolidatorService>() },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
