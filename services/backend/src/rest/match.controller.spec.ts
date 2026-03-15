import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { mock } from 'jest-mock-extended';
import { MatchService } from '../persistence/match.service';
import { MatchImportService } from '../import/match-import.service';

describe('MatchController', () => {
  let controller: MatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        { provide: MatchService, useValue: mock<MatchService>() },
        { provide: MatchImportService, useValue: mock<MatchImportService>() },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
