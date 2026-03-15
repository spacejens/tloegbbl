import { Test, TestingModule } from '@nestjs/testing';
import { TeamTypesService } from './team-types.service';
import { mock } from 'jest-mock-extended';
import { ApiClientService } from '../api-client/api-client.service';

describe('TeamTypesService', () => {
  let service: TeamTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamTypesService,
        { provide: ApiClientService, useValue: mock<ApiClientService>() },
      ],
    }).compile();

    service = module.get<TeamTypesService>(TeamTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
