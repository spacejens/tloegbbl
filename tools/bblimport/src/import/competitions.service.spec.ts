import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionsService } from './competitions.service';
import { ApiClientService } from '../api-client/api-client.service';
import { mock } from 'jest-mock-extended';
import { FileReaderService } from './filereader.service';
import { ApiUtilsService } from '../api-client/api-utils.service';

describe('CompetitionsService', () => {
  let service: CompetitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionsService,
        { provide: FileReaderService, useValue: mock<FileReaderService>() },
        { provide: ApiClientService, useValue: mock<ApiClientService>() },
        { provide: ApiUtilsService, useValue: mock<ApiUtilsService>() },
      ],
    }).compile();

    service = module.get<CompetitionsService>(CompetitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
