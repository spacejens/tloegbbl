import { HttpWrapperService } from './http-wrapper.service';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ExternallyIdentifiable } from '../dtos';

export type ReturnedFields = ReturnedField[];

export type ReturnedField = string | ReturnedSubfield;

export type ReturnedSubfield = { [fieldName: string]: ReturnedFields };

@Injectable()
export class ApiClientService {
  constructor(private readonly httpService: HttpWrapperService) {}

  async post(path: string, argument: any): Promise<AxiosResponse<any, any>> {
    const result = await this.httpService.post(
      // TODO Get API URL from configuration
      'http://localhost:3000/' + path,
      argument,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (result.status != 201 || result.data.errors) {
      throw new Error(
        `Unexpected result from REST POST: ${result.status} ${
          result.statusText
        } ${JSON.stringify(result.data)}`,
      );
    }
    return result;
  }
}
