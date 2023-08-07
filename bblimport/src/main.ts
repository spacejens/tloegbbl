import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { ImportService } from './import/import.service';
import { SanityCheckService } from './sanitycheck/sanitycheck.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const importService = app.get(ImportService);
  importService.importEverything();
  const sanityCheckService = app.get(SanityCheckService);
  sanityCheckService.sanityCheckEverything();
  const appService = app.get(AppService);
  console.log(appService.getHello());
}
bootstrap();
