import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpWrapperService {
  constructor(private readonly httpService: HttpService) {}

  async post(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any, any>> {
    return firstValueFrom(this.httpService.post(url, data, config));
  }
}
