import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LeaguesDownloaderService } from './downloader/leagues-downloader.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const leagueDownloaderService = app.get(LeaguesDownloaderService);
  await leagueDownloaderService.downloadAllLeagues();
}
bootstrap();
