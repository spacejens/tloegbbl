import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';
import { mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';

describe('ApiResponseRecordingPageViewerService', () => {
  let service: ApiResponseRecordingPageViewerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiResponseRecordingPageViewerService,
        { provide: ConfigService, useValue: mock<ConfigService>() },
      ],
    }).compile();

    service = module.get<ApiResponseRecordingPageViewerService>(ApiResponseRecordingPageViewerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
