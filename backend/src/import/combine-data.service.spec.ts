import { Test, TestingModule } from '@nestjs/testing';
import { CombineDataService } from './combine-data.service';

describe('CombineDataService', () => {
  let service: CombineDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CombineDataService],
    }).compile();

    service = module.get<CombineDataService>(CombineDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
