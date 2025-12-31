import { Module } from '@nestjs/common';
import { LeaguesDownloaderService } from './leagues-downloader.service';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';
import { ApiResponseStoringPageViewerService } from './api-response-storing-page-viewer.service';
import { FileSystemService } from './file-system.service';

@Module({
  providers: [LeaguesDownloaderService, ApiResponseRecordingPageViewerService, ApiResponseStoringPageViewerService, FileSystemService],
  exports: [LeaguesDownloaderService],
})
export class DownloaderModule {}
