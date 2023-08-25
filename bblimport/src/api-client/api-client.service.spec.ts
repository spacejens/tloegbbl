import { Test, TestingModule } from '@nestjs/testing';
import { ApiClientService } from './api-client.service';
import { HttpWrapperService } from './http-wrapper.service';
import { mock } from 'jest-mock-extended';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpService: HttpWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiClientService,
        { provide: HttpWrapperService, useValue: mock<HttpWrapperService>() },
      ],
    }).compile();

    service = module.get<ApiClientService>(ApiClientService);
    httpService = module.get<HttpWrapperService>(HttpWrapperService);

    httpService.post = jest.fn().mockImplementation(() => {
      return {
        status: 200,
        data: {},
      };
    });
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
  });

  describe('mutation', () => {
    describe('format arguments', () => {
      it('empty argument as empty', () => {
        service.mutation('theName', 'theArgument', {}, []);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {}) {}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });

      it('numerical argument as plain value', () => {
        service.mutation('theName', 'theArgument', { num: 3 }, []);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {num:3}) {}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });

      it('string argument with quotes', () => {
        service.mutation('theName', 'theArgument', { str: 'text' }, []);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {str:"text"}) {}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });

      it('undefined argument should be excluded', () => {
        service.mutation(
          'theName',
          'theArgument',
          { present: 'here', missing: undefined },
          [],
        );
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {present:"here"}) {}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
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
          [],
        );
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {inner:{key:"value"}}) {}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
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
          [],
        );
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query:
              'mutation {theName(theArgument: {array:[{first:"value"},{second:"value"}]}) {}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });
    });

    describe('format returned fields', () => {
      it('no returned fields', () => {
        service.mutation('theName', 'theArgument', {}, []);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {}) {}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });

      it('field names', () => {
        service.mutation('theName', 'theArgument', {}, ['id', 'name']);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {}) {id,name}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });

      it('field structure', () => {
        service.mutation('theName', 'theArgument', {}, [
          'id',
          { externalIds: ['id', 'externalId', 'externalSystem'] },
          'name',
        ]);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query:
              'mutation {theName(theArgument: {}) {id,externalIds {id,externalId,externalSystem},name}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
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
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query:
              'mutation {theName(theArgument: {}) {id,externalIds {id,externalId,externalSystem},more {stuff},name}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });
    });

    describe('error handling', () => {
      it('HTTP status is not 200', async () => {
        httpService.post = jest.fn().mockImplementation(() => {
          return {
            status: 201,
            data: {},
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

      it('data contains errors', async () => {
        httpService.post = jest.fn().mockImplementation(() => {
          return {
            status: 200,
            data: {
              errors: 'exist',
            },
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
