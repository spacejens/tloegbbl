import { Module } from '@nestjs/common';
import { ImportService } from './import.service';
import { ConfigModule } from '@nestjs/config';
import { ApiClientModule } from '@tloegbbl/api-client';

@Module({
  imports: [ApiClientModule, ConfigModule],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
