import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionsService } from './competitions.service';
import { HttpService } from '@nestjs/axios';
import { mock } from 'jest-mock-extended';
import { FileReaderService } from './filereader.service';

describe('CompetitionsService', () => {
  let service: CompetitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionsService,
        { provide: FileReaderService, useValue: mock<FileReaderService>() },
        { provide: HttpService, useValue: mock<HttpService>() },
      ],
    }).compile();

    service = module.get<CompetitionsService>(CompetitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
