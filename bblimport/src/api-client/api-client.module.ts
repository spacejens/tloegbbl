import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiClientService } from './api-client.service';
import { HttpWrapperService } from './http-wrapper.service';
import { ApiUtilsService } from './api-utils.service';

@Module({
  imports: [HttpModule],
  providers: [ApiClientService, HttpWrapperService, ApiUtilsService],
  exports: [ApiClientService, ApiUtilsService],
})
export class ApiClientModule {}
