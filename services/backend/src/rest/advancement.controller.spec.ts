import { Test, TestingModule } from '@nestjs/testing';
import { AdvancementController } from './advancement.controller';
import { mock } from 'jest-mock-extended';
import { AdvancementService } from '../persistence/advancement.service';
import { AdvancementImportService } from '../import/advancement-import.service';

describe('AdvancementController', () => {
  let controller: AdvancementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvancementController],
      providers: [
        { provide: AdvancementService, useValue: mock<AdvancementService>() },
        {
          provide: AdvancementImportService,
          useValue: mock<AdvancementImportService>(),
        },
      ],
    }).compile();

    controller = module.get<AdvancementController>(AdvancementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
