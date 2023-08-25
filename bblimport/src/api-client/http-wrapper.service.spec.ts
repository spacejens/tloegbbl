import { Test, TestingModule } from '@nestjs/testing';
import { HttpWrapperService } from './http-wrapper.service';
import { HttpService } from '@nestjs/axios';
import { mock } from 'jest-mock-extended';

describe('HttpWrapperService', () => {
  let service: HttpWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpWrapperService,
        { provide: HttpService, useValue: mock<HttpService>() },
      ],
    }).compile();

    service = module.get<HttpWrapperService>(HttpWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // This class exists specifically for those things that are hard to unit test
});
