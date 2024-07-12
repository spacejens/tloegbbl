import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { ApiClientService } from '../api-client/api-client.service';
import { mock } from 'jest-mock-extended';
import { FileReaderService } from './filereader.service';
import { AdvancementsService } from './advancements.service';
import { ApiUtilsService } from '../api-client/api-utils.service';

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: FileReaderService, useValue: mock<FileReaderService>() },
        { provide: AdvancementsService, useValue: mock<AdvancementsService>() },
        { provide: ApiClientService, useValue: mock<ApiClientService>() },
        { provide: ApiUtilsService, useValue: mock<ApiUtilsService>() },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
