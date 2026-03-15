import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';

describe('ApiResponseRecordingPageViewerService', () => {
  let service: ApiResponseRecordingPageViewerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiResponseRecordingPageViewerService],
    }).compile();

    service = module.get<ApiResponseRecordingPageViewerService>(ApiResponseRecordingPageViewerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
