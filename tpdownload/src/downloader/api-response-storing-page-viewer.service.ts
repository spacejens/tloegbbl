import { Injectable } from '@nestjs/common';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';
import { FileSystemService } from './file-system.service';

@Injectable()
export class ApiResponseStoringPageViewerService {

  constructor(
    private readonly apiResponseRecordingPageViewerService: ApiResponseRecordingPageViewerService,
    private readonly fileSystemService: FileSystemService,
  ) {}

  async viewPage(pageUrl: string, dirName: string): Promise<Map<string, any>> {
    const pageResult = await this.apiResponseRecordingPageViewerService.viewPage(pageUrl);
    // Terminate if something unexpected occurred
    if (pageResult.hasErrorsOrWarnings) {
      console.error('Something went wrong!');
      console.error(`Console errors: ${JSON.stringify(pageResult.consoleErrors)}`);
      console.error(`Console warnings: ${JSON.stringify(pageResult.consoleWarnings)}`);
      console.error(`Page errors: ${JSON.stringify(pageResult.pageErrors)}`);
      throw new Error(`Failed to view ${pageUrl}`);
    }
    // Store the responses in files
    pageResult.apiResponses.forEach((response, requestUrl) => {
      this.fileSystemService.writeJsonFile(dirName, requestUrl, response);
    });
    // Return the responses
    return pageResult.apiResponses;
  }
}
