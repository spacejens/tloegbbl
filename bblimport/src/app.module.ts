import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImportModule } from './import/import.module';
import { SanityCheckModule } from './sanitycheck/sanitycheck.module';

@Module({
  imports: [ImportModule, SanityCheckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
