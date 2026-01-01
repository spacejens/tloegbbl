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
      await this.downloadLeague(frontendUrl + tournamentName, dirName);
    }
  }

  private async downloadLeague(tournamentUrl: string, dirName: string): Promise<void> {
    await this.pageViewerService.viewPage(tournamentUrl + '/news', dirName);
    const fixturesPageResult = await this.pageViewerService.viewPage(tournamentUrl + '/scores', dirName);
    // TODO For the fixtures sub-page, also visit each match page
    await this.pageViewerService.viewPage(tournamentUrl + '/classifications', dirName);
    const honoursPageResult = await this.pageViewerService.viewPage(tournamentUrl + '/honours', dirName);
    // TOOD For the honours page, need to click team/player/coach
    await this.pageViewerService.viewPage(tournamentUrl + '/statistics', dirName);
    const participantsPageResult = await this.pageViewerService.viewPage(tournamentUrl + '/players', dirName);
    // TODO For the participants list sub-page, also visit each team
    await this.pageViewerService.viewPage(tournamentUrl + '/awards', dirName);
  }
}
