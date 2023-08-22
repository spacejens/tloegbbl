import { Test, TestingModule } from '@nestjs/testing';
import { TeamTypesService } from './team-types.service';
import { HttpService } from '@nestjs/axios';
import { mock } from 'jest-mock-extended';

describe('TeamTypesService', () => {
  let service: TeamTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamTypesService,
        { provide: HttpService, useValue: mock<HttpService>() },
      ],
    }).compile();

    service = module.get<TeamTypesService>(TeamTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
