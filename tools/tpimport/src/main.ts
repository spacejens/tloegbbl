import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImportService } from './import/import.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const importService = app.get(ImportService);
  await importService.importEverything();
}
bootstrap();
