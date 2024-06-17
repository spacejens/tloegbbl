import { Test, TestingModule } from '@nestjs/testing';
import { CompetitionController } from './competition.controller';
import { mock } from 'jest-mock-extended';
import { CompetitionService } from '../persistence/competition.service';
import { CompetitionImportService } from '../import/competition-import.service';

describe('CompetitionController', () => {
  let controller: CompetitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetitionController],
      providers: [
        { provide: CompetitionService, useValue: mock<CompetitionService>() },
        { provide: CompetitionImportService, useValue: mock<CompetitionImportService>() },
      ],
    }).compile();

    controller = module.get<CompetitionController>(CompetitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
