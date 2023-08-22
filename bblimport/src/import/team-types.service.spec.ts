import { Test, TestingModule } from '@nestjs/testing';
import { TeamTypesService } from './team-types.service';

describe('TeamTypesService', () => {
  let service: TeamTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamTypesService],
    }).compile();

    service = module.get<TeamTypesService>(TeamTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
