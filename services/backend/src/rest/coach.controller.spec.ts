import { Test, TestingModule } from '@nestjs/testing';
import { CoachController } from './coach.controller';
import { mock } from 'jest-mock-extended';
import { CoachService } from '../persistence/coach.service';
import { CoachImportService } from '../import/coach-import.service';

describe('CoachController', () => {
  let controller: CoachController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoachController],
      providers: [
        { provide: CoachService, useValue: mock<CoachService>() },
        { provide: CoachImportService, useValue: mock<CoachImportService>() },
      ],
    }).compile();

    controller = module.get<CoachController>(CoachController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
