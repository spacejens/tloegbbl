import { Test, TestingModule } from '@nestjs/testing';
import { LeaguesDownloaderService } from './leagues-downloader.service';

describe('LeaguesDownloaderService', () => {
  let service: LeaguesDownloaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaguesDownloaderService],
    }).compile();

    service = module.get<LeaguesDownloaderService>(LeaguesDownloaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
