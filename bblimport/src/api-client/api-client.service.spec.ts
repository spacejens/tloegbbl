import { Test, TestingModule } from '@nestjs/testing';
import { ApiClientService } from './api-client.service';
import { mock } from 'jest-mock-extended';
import { ApolloApiClientService } from './apollo-api-client.service';
import { gql } from '@apollo/client/core';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let apollo: ApolloApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiClientService,
        {
          provide: ApolloApiClientService,
          useValue: mock<ApolloApiClientService>(),
        },
      ],
    }).compile();

    service = module.get<ApiClientService>(ApiClientService);
    apollo = module.get<ApolloApiClientService>(ApolloApiClientService);

    apollo.mutate = jest.fn().mockReturnValue({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('externalId', () => {
    it('should wrap in object with external system', () => {
      expect(service.externalId('MyId')).toEqual({
        externalId: 'MyId',
        externalSystem: 'tloeg.bbleague.se',
      });
    });

    it('should ignore undefined values', () => {
      expect(service.externalId(undefined)).toBe(undefined);
    });
  });

  describe('mutation', () => {
    describe('format arguments', () => {
      it('empty argument as empty', () => {
        service.mutation('theName', 'theArgument', {}, ['id']);
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql('mutation {theName(theArgument: {}) {id}}'),
        });
      });

      it('numerical argument as plain value', () => {
        service.mutation('theName', 'theArgument', { num: 3 }, ['id']);
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql('mutation {theName(theArgument: {num:3}) {id}}'),
        });
      });

      it('string argument quoted', () => {
        service.mutation('theName', 'theArgument', { str: 'text' }, ['id']);
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql('mutation {theName(theArgument: {str:"text"}) {id}}'),
        });
      });

      it('string argument with quotes escaped and quoted', () => {
        service.mutation('theName', 'theArgument', { str: 'te"x"t' }, ['id']);
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql(
            'mutation {theName(theArgument: {str:"te\\"x\\"t"}) {id}}',
          ),
        });
      });

      it('undefined argument should be excluded', () => {
        service.mutation(
          'theName',
          'theArgument',
          { present: 'here', missing: undefined },
          ['id'],
        );
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql(
            'mutation {theName(theArgument: {present:"here"}) {id}}',
          ),
        });
      });

      it('structured argument as same structure', () => {
        service.mutation(
          'theName',
          'theArgument',
          {
            inner: {
              key: 'value',
            },
          },
          ['id'],
        );
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql(
            'mutation {theName(theArgument: {inner:{key:"value"}}) {id}}',
          ),
        });
      });

      it('array argument as same structure', () => {
        service.mutation(
          'theName',
          'theArgument',
          {
            array: [
              {
                first: 'value',
              },
              {
                second: 'value',
              },
            ],
          },
          ['id'],
        );
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql(
            'mutation {theName(theArgument: {array:[{first:"value"},{second:"value"}]}) {id}}',
          ),
        });
      });

      it('array argument ignores undefined elements', () => {
        service.mutation(
          'theName',
          'theArgument',
          {
            array: [
              {
                only: 'value',
              },
              undefined,
            ],
          },
          ['id'],
        );
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql(
            'mutation {theName(theArgument: {array:[{only:"value"}]}) {id}}',
          ),
        });
      });
    });

    describe('format returned fields', () => {
      // TODO Restore this commented out test case. Perhaps need to omit the returned brackets entirely in expected result? If so, also do that for tests above
      /*
      it('no returned fields', () => {
        service.mutation('theName', 'theArgument', {}, []);
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql('mutation {theName(theArgument: {}) {}}'),
        });
      });
      */

      it('field names', () => {
        service.mutation('theName', 'theArgument', {}, ['id', 'name']);
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql('mutation {theName(theArgument: {}) {id,name}}'),
        });
      });

      it('field structure', () => {
        service.mutation('theName', 'theArgument', {}, [
          'id',
          { externalIds: ['id', 'externalId', 'externalSystem'] },
          'name',
        ]);
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql(
            'mutation {theName(theArgument: {}) {id,externalIds {id,externalId,externalSystem},name}}',
          ),
        });
      });

      it('field structure with multiple lists (weird edge case)', () => {
        service.mutation('theName', 'theArgument', {}, [
          'id',
          {
            externalIds: ['id', 'externalId', 'externalSystem'],
            more: ['stuff'],
          },
          'name',
        ]);
        expect(apollo.mutate).toHaveBeenCalledWith({
          mutation: gql(
            'mutation {theName(theArgument: {}) {id,externalIds {id,externalId,externalSystem},more {stuff},name}}',
          ),
        });
      });
    });

    describe('error handling', () => {
      it('data contains errors', async () => {
        apollo.mutate = jest.fn().mockImplementation(() => {
          return {
            errors: 'exist',
          };
        });
        let gotException: boolean = false;
        await service
          .mutation('theName', 'theArgument', {}, [])
          .catch(() => {
            gotException = true;
          })
          .finally(() => {
            expect(gotException).toBe(true);
          });
      });
    });
  });
});
