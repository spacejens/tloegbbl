import { Injectable } from '@nestjs/common';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';

@Injectable()
export class ApiResponseStoringPageViewerService {

  constructor(
    private readonly apiResponseRecordingPageViewerService: ApiResponseRecordingPageViewerService,
  ) {}

  async viewPage(pageUrl: string): Promise<Map<string, any>> {
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
    // TODO Store each response in its own file, subfolder from config
    // Return the responses
    return pageResult.apiResponses;
  }
}
