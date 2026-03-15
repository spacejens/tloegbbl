import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemService } from './file-system.service';
import { mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';

describe('FileSystemService', () => {
  let service: FileSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileSystemService,
        { provide: ConfigService, useValue: mock<ConfigService>() },
      ],
    }).compile();

    service = module.get<FileSystemService>(FileSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
