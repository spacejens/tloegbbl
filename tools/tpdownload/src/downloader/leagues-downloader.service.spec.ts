import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesDownloaderService } from './leagues-downloader.service';
import { mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import { ApiResponseStoringPageViewerService } from './api-response-storing-page-viewer.service';
import { FileSystemService } from './file-system.service';

describe('LeaguesDownloaderService', () => {
  let service: LeaguesDownloaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaguesDownloaderService,
        { provide: ConfigService, useValue: mock<ConfigService>() },
        { provide: ApiResponseStoringPageViewerService, useValue: mock<ApiResponseStoringPageViewerService>() },
        { provide: FileSystemService, useValue: mock<FileSystemService>() },
      ],
    }).compile();

    service = module.get<LeaguesDownloaderService>(LeaguesDownloaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
