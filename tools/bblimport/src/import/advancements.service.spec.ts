import { Test, TestingModule } from '@nestjs/testing';
import { AdvancementsService } from './advancements.service';
import { mock } from 'jest-mock-extended';
import { ApiClientService } from '../api-client/api-client.service';

describe('AdvancementsService', () => {
  let service: AdvancementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvancementsService,
        { provide: ApiClientService, useValue: mock<ApiClientService>() },
      ],
    }).compile();

    service = module.get<AdvancementsService>(AdvancementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
