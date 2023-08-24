import { Test, TestingModule } from '@nestjs/testing';
import { ApiClientService } from './api-client.service';
import { HttpService } from '@nestjs/axios';
import { mock } from 'jest-mock-extended';

describe('ApiClientService', () => {
  let service: ApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiClientService,
        { provide: HttpService, useValue: mock<HttpService>() },
      ],
    }).compile();

    service = module.get<ApiClientService>(ApiClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO Add tests for the whole mutation method

  it('should format argument correctly', () => {
    expect(service.formatArgument({})).toBe('{}');
    expect(
      service.formatArgument({
        num: 3,
      }),
    ).toBe('{num:3}');
    expect(
      service.formatArgument({
        str: 'text',
      }),
    ).toBe('{str:"text"}');
    expect(
      service.formatArgument({
        present: 'here',
        missing: undefined,
      }),
    ).toBe('{present:"here"}');
    expect(
      service.formatArgument({
        inner: {
          key: 'value',
        },
      }),
    ).toBe('{inner:{key:"value"}}');
    expect(
      service.formatArgument({
        array: [
          {
            first: 'value',
          },
          {
            second: 'value',
          },
        ],
      }),
    ).toBe('{array:[{first:"value"},{second:"value"}]}');
  });

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
