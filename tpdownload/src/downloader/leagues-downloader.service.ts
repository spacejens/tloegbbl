import { Injectable } from '@nestjs/common';

@Injectable()
export class LeaguesDownloaderService {

  async importAllLeagues(): Promise<void> {
    console.log('Importing not implemented yet');
    // TODO Get list of league URLs from local config
  }
}
