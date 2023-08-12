import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from './import.controller';
import { CoachImportService } from './coach-import.service';
import { mock } from 'jest-mock-extended';

describe('ImportController', () => {
  let controller: ImportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [
        { provide: CoachImportService, useValue: mock<CoachImportService>() },
      ],
    }).compile();

    controller = module.get<ImportController>(ImportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
