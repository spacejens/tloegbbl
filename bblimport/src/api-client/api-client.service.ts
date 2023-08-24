import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type ReturnedFields = ReturnedField[];

export type ReturnedField = string | ReturnedSubfield;

export type ReturnedSubfield = { [fieldName: string]: ReturnedFields };

@Injectable()
export class ApiClientService {
  constructor(private readonly httpService: HttpService) {}

  async mutation(
    name: string,
    argumentName: string,
    argument: any,
    returnedFields: ReturnedFields,
  ): Promise<any> {
    // TODO Define better typing of API result
    // TODO Use Axios variable substitution instead of assembling whole query string
    const query: string = `mutation {${name}(${argumentName}: ${this.formatArgument(
      argument,
    )}) ${this.formatReturnedFields(returnedFields)}}`;
    const result = await firstValueFrom(
      this.httpService.post(
        // TODO Get API URL from configuration
        'http://localhost:3000/api',
        {
          query: query,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    if (result.status != 200 || result.data.errors) {
      throw new Error(
        `Unexpected result from mutation API: ${result.status} ${
          result.statusText
        } ${JSON.stringify(result.data)}`,
      );
    }
    return result;
  }

  // TODO Make private after test has verified that it kind of works
  formatArgument(argument: any): string {
    if (argument instanceof Array) {
      return (
        '[' +
        argument
          .map((value) => {
            return this.formatArgument(value);
          })
          .join(',') +
        ']'
      );
    }
    return (
      '{' +
      Object.keys(argument)
        .filter((key) => argument[key] != undefined)
        .map((key) => {
          if (typeof argument[key] === 'number') {
            return key + ':' + argument[key];
          } else if (typeof argument[key] === 'string') {
            return key + ':"' + argument[key] + '"';
          } else {
            return key + ':' + this.formatArgument(argument[key]);
          }
        })
        .join(',') +
      '}'
    );
  }

  // TODO Make private after test has verified that it kind of works
  formatReturnedFields(returnedFields: ReturnedFields): string {
    return (
      '{' +
      returnedFields
        .map((returnedField) => {
          if (typeof returnedField === 'string') {
            return returnedField;
          } else {
            const returnedSubfield = returnedField as ReturnedSubfield;
            return Object.keys(returnedSubfield)
              .map((key) => {
                return (
                  key + ' ' + this.formatReturnedFields(returnedSubfield[key])
                );
              })
              .join(',');
          }
        })
        .join(',') +
      '}'
    );
  }
}
