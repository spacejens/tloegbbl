import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaguesDownloaderService {

  async downloadAllLeagues(): Promise<void> {
    console.log('Downloading not implemented yet');
    // TODO Get list of league URLs from local config
  }
}
