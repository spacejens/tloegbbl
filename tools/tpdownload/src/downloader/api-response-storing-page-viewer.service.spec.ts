import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseStoringPageViewerService } from './api-response-storing-page-viewer.service';
import { mock } from 'jest-mock-extended';
import { FileSystemService } from './file-system.service';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';

describe('ApiResponseStoringPageViewerService', () => {
  let service: ApiResponseStoringPageViewerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiResponseStoringPageViewerService,
        { provide: ApiResponseRecordingPageViewerService, useValue: mock<ApiResponseRecordingPageViewerService>() },
        { provide: FileSystemService, useValue: mock<FileSystemService>() },
      ],
    }).compile();

    service = module.get<ApiResponseStoringPageViewerService>(ApiResponseStoringPageViewerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
