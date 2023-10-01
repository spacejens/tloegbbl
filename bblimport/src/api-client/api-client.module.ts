import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiClientService } from './api-client.service';
import { ApolloApiClientService } from './apollo-api-client.service';

@Module({
  imports: [HttpModule],
  providers: [ApiClientService, ApolloApiClientService],
  exports: [ApiClientService],
})
export class ApiClientModule {}
