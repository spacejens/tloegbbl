import { Injectable } from '@nestjs/common';
import { ApiResponseRecordingPageViewerService } from './api-response-recording-page-viewer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LeaguesDownloaderService {

  constructor(
    private readonly configService: ConfigService,
    private readonly pageViewerService: ApiResponseRecordingPageViewerService,
  ) {}

  async downloadAllLeagues(): Promise<void> {
    const frontendUrl: string = this.configService.get('TP_FRONTEND_URL');
    const tournaments: string = this.configService.get('TOURNAMENTS');
    for (var tournamentName of tournaments.split(',')) {
      await this.downloadLeague(frontendUrl + tournamentName + '/scores');
    }
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
