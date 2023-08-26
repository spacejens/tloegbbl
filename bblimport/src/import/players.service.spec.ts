import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { ApiClientService } from '../api-client/api-client.service';
import { mock } from 'jest-mock-extended';
import { FileReaderService } from './filereader.service';

describe('PlayersService', () => {
  let service: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: FileReaderService, useValue: mock<FileReaderService>() },
        { provide: ApiClientService, useValue: mock<ApiClientService>() },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
