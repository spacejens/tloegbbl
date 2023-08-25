import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiClientService } from './api-client.service';
import { HttpWrapperService } from './http-wrapper.service';

@Module({
  imports: [HttpModule],
  providers: [ApiClientService, HttpWrapperService],
  exports: [ApiClientService],
})
export class ApiClientModule {}
