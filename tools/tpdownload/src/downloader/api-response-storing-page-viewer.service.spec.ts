import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseStoringPageViewerService } from './api-response-storing-page-viewer.service';

describe('ApiResponseStoringPageViewerService', () => {
  let service: ApiResponseStoringPageViewerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiResponseStoringPageViewerService],
    }).compile();

    service = module.get<ApiResponseStoringPageViewerService>(ApiResponseStoringPageViewerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
