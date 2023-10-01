import { Injectable } from '@nestjs/common';
import { ApolloApiClientService } from './apollo-api-client.service';
import { FetchResult, gql } from '@apollo/client/core';

export type ReturnedFields = ReturnedField[];

export type ReturnedField = string | ReturnedSubfield;

export type ReturnedSubfield = { [fieldName: string]: ReturnedFields };

@Injectable()
export class ApiClientService {
  constructor(private readonly apollo: ApolloApiClientService) {}

  // TODO Replace this implementation with actual generated (from schema) GraphQL code of some kind

  externalId(id: string) {
    return (
      id && {
        externalId: id,
        externalSystem: 'tloeg.bbleague.se', // TODO Get externalSystem from configuration
      }
    );
  }

  async mutation(
    name: string,
    argumentName: string,
    argument: any,
    returnedFields: ReturnedFields,
  ): Promise<FetchResult<any>> {
    const query: string = `mutation {${name}(${argumentName}: ${this.formatArgument(
      argument,
    )}) ${this.formatReturnedFields(returnedFields)}}`;
    console.log(`SENDING ${query}\nGQL ${JSON.stringify(gql(query))}`);
    const result = await this.apollo.mutate({
      mutation: gql(query),
    });
    if (result.errors) {
      throw new Error(
        `Unexpected result from mutation API: ${result.errors} ${JSON.stringify(
          result.data,
        )}`,
      );
    }
    return result;
  }

  private formatArgument(argument: any): string {
    if (argument instanceof Array) {
      return (
        '[' +
        argument
          .filter((value) => value != undefined)
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
            const value = (argument[key] as string).replace(/"/gi, '\\"');
            return key + ':"' + value + '"';
          } else {
            return key + ':' + this.formatArgument(argument[key]);
          }
        })
        .join(',') +
      '}'
    );
  }

  private formatReturnedFields(returnedFields: ReturnedFields): string {
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
