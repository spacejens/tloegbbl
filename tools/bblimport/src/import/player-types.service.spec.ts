import { Test, TestingModule } from '@nestjs/testing';
import { PlayerTypesService } from './player-types.service';
import { mock } from 'jest-mock-extended';
import { ApiClientService } from '../api-client/api-client.service';
import { FileReaderService } from './filereader.service';
import { AdvancementsService } from './advancements.service';
import { TeamTypesService } from './team-types.service';
import { ApiUtilsService } from '../api-client/api-utils.service';

describe('PlayerTypesService', () => {
  let service: PlayerTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerTypesService,
        { provide: FileReaderService, useValue: mock<FileReaderService>() },
        { provide: ApiClientService, useValue: mock<ApiClientService>() },
        { provide: ApiUtilsService, useValue: mock<ApiUtilsService>() },
        { provide: AdvancementsService, useValue: mock<AdvancementsService>() },
        { provide: TeamTypesService, useValue: mock<TeamTypesService>() },
      ],
    }).compile();

    service = module.get<PlayerTypesService>(PlayerTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
