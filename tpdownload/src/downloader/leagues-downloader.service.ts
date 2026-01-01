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
      await this.downloadLeague(frontendUrl + tournamentName, frontendUrl, dirName);
    }
  }

  private async downloadLeague(tournamentUrl: string, frontendUrl: string, dirName: string): Promise<void> {
    await this.pageViewerService.viewPage(tournamentUrl + '/news', dirName);
    const fixturesPageResult = await this.pageViewerService.viewPage(tournamentUrl + '/scores', dirName);
    await this.downloadMatches(fixturesPageResult, tournamentUrl, dirName);
    await this.pageViewerService.viewPage(tournamentUrl + '/classifications', dirName);
    const honoursPageResult = await this.pageViewerService.viewPage(tournamentUrl + '/honours', dirName);
    // TOOD For the honours page, need to click team/player/coach
    await this.pageViewerService.viewPage(tournamentUrl + '/statistics', dirName);
    const participantsPageResult = await this.pageViewerService.viewPage(tournamentUrl + '/players', dirName);
    await this.downloadParticipants(participantsPageResult, frontendUrl, dirName);
    await this.pageViewerService.viewPage(tournamentUrl + '/awards', dirName);
  }

  private async downloadMatches(fixturesPageResult: Map<string, any>, tournamentUrl: string, dirName: string): Promise<void> {
    const matchListResponse = this.findResponse('phases?type=COACH', fixturesPageResult);
    for (var topLevelProperty of Object.values(matchListResponse)) {
      const topLevelProp: any = topLevelProperty;
      for (var round of topLevelProp.rounds) {
        for (var group of round.groups) {
          for (var match of group.matches) {
            await this.pageViewerService.viewPage(tournamentUrl + '/match/' + match.matchId, dirName);
          }
        }
      }
    }
  }

  private async downloadParticipants(participantsPageResult: Map<string, any>, frontendUrl: string, dirName: string): Promise<void> {
    const participantsListResponse = this.findResponse('inscriptions', participantsPageResult);
    for (var topLevelProperty of Object.values(participantsListResponse)) {
      const topLevelProp: any = topLevelProperty;
      for (var inscription of topLevelProp) {
        await this.pageViewerService.viewPage(frontendUrl + 'roster/' + inscription.roster.id, dirName);
      }
    }
  }

  private findResponse(urlSuffix: string, pageResult: Map<string, any>) {
    let foundResponse: any;
    pageResult.forEach((response, requestUrl) => {
      if (requestUrl.endsWith(urlSuffix)) {
        foundResponse = response;
      }
    });
    if (foundResponse) {
      return foundResponse;
    }
    throw new Error(`Did not find expected response with URL suffix ${urlSuffix}`);
  }
}
