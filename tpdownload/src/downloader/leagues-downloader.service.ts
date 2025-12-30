import { Injectable } from '@nestjs/common';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';

@Injectable()
export class LeaguesDownloaderService {

  constructor(
    readonly pageViewerService: ApiResponseRecordingPageViewerService,
  ) {}

  async downloadAllLeagues(): Promise<void> {
    // TODO Get list of league URLs from local config
    await this.downloadLeague('https://tourplay.net/en/blood-bowl/-ogretoberfest-12--/scores');
  }

  private async downloadLeague(url: string): Promise<void> {
    const leaguePageResult = await this.pageViewerService.viewPage(url);
    leaguePageResult.apiResponses.forEach(async (response, requestUrl) => {
      console.log(`${requestUrl} : ${JSON.stringify(response)}`);
    });
    if (leaguePageResult.hasErrorsOrWarnings) {
      console.log('Something went wrong!');
    }
  }
}
