import { Module } from '@nestjs/common';
import { LeaguesDownloaderService } from './leagues-downloader.service';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';

@Module({
  providers: [LeaguesDownloaderService, ApiResponseRecordingPageViewerService],
  exports: [LeaguesDownloaderService],
})
export class DownloaderModule {}
