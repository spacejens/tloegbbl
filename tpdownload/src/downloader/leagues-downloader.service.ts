import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResponseStoringPageViewerService } from './api-response-storing-page-viewer.service';
import { FileSystemService } from './file-system.service';

@Injectable()
export class LeaguesDownloaderService {

  constructor(
    private readonly configService: ConfigService,
    private readonly pageViewerService: ApiResponseStoringPageViewerService,
    private readonly fileSystemService: FileSystemService,
  ) {}

  async downloadAllLeagues(): Promise<void> {
    const frontendUrl: string = this.configService.get('TP_FRONTEND_URL');
    const tournaments: string = this.configService.get('TOURNAMENTS');
    for (var tournamentName of tournaments.split(',')) {
      const dirName = `tournaments/${tournamentName}`;
      this.fileSystemService.mkdir(dirName);
      await this.downloadLeague(frontendUrl + tournamentName + '/scores', dirName);
    }
  }

  private async downloadLeague(url: string, dirName: string): Promise<void> {
    // TODO Get league base URL as argument, visit various sub-pages here
    const leaguePageResult = await this.pageViewerService.viewPage(url, dirName);
    // TODO For the match list sub-page, also visit match pages
    // TODO For the participants list sub-page, also visit each team
  }
}
