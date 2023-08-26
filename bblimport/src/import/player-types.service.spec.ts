import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypesService } from './player-types.service';
import { mock } from 'jest-mock-extended';
import { ApiClientService } from '../api-client/api-client.service';

describe('PlayerTypesService', () => {
  let service: PlayerTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerTypesService,
        { provide: ApiClientService, useValue: mock<ApiClientService>() },
      ],
    }).compile();

    service = module.get<PlayerTypesService>(PlayerTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
