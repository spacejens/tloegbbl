import { Module } from '@nestjs/common';
import { LeaguesDownloaderService } from './leagues-downloader.service';

@Module({
  providers: [LeaguesDownloaderService],
  exports: [LeaguesDownloaderService],
})
export class DownloaderModule {}
