import { Test, TestingModule } from '@nestjs/testing';
import { CoachImportService } from './coach-import.service';

describe('CoachImportService', () => {
  let service: CoachImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoachImportService],
    }).compile();

    service = module.get<CoachImportService>(CoachImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
