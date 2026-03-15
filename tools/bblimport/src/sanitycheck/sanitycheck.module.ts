import { Module } from '@nestjs/common';
import { SanityCheckService } from './sanitycheck.service';

@Module({
  providers: [SanityCheckService],
  exports: [SanityCheckService],
})
export class SanityCheckModule {}
