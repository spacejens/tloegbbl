import { Test, TestingModule } from '@nestjs/testing';
import { MatchEventController } from './match-event.controller';
import { mock } from 'jest-mock-extended';
import { MatchEventService } from '../persistence/match-event.service';
import { MatchEventImportService } from '../import/match-event-import.service';

describe('MatchEventController', () => {
  let controller: MatchEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchEventController],
      providers: [
        { provide: MatchEventService, useValue: mock<MatchEventService>() },
        {
          provide: MatchEventImportService,
          useValue: mock<MatchEventImportService>(),
        },
      ],
    }).compile();

    controller = module.get<MatchEventController>(MatchEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
