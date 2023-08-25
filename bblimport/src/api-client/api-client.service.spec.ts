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
        service.mutation('theName', 'theArgument', {}, ['id']);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {}) {id}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });

      it('numerical argument as plain value', () => {
        service.mutation('theName', 'theArgument', { num: 3 }, ['id']);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {num:3}) {id}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });

      it('string argument with quotes', () => {
        service.mutation('theName', 'theArgument', { str: 'text' }, ['id']);
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {str:"text"}) {id}}',
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
          ['id'],
        );
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {present:"here"}) {id}}',
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
          ['id'],
        );
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {inner:{key:"value"}}) {id}}',
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
          ['id'],
        );
        expect(httpService.post).toHaveBeenCalledWith(
          'http://localhost:3000/api',
          {
            query: 'mutation {theName(theArgument: {array:[{first:"value"},{second:"value"}]}) {id}}',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      });
    });

    // TODO Add tests for checking result of POST (successful, and failures throwing exceptions)
  });

  // TODO Add tests for the whole mutation method

  it('should format returned fields correctly', () => {
    expect(service.formatReturnedFields(['id', 'name'])).toBe('{id,name}');
    expect(
      service.formatReturnedFields([
        'id',
        {
          externalIds: ['id', 'externalId', 'externalSystem'],
        },
        'name',
      ]),
    ).toBe('{id,externalIds {id,externalId,externalSystem},name}');
    expect(
      service.formatReturnedFields([
        'id',
        {
          externalIds: ['id', 'externalId', 'externalSystem'],
          more: ['stuff'],
        },
        'name',
      ]),
    ).toBe('{id,externalIds {id,externalId,externalSystem},more {stuff},name}');
  });
});
