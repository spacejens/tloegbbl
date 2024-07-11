import { Test, TestingModule } from '@nestjs/testing';
import { TeamTypeController } from './team-type.controller';
import { mock } from 'jest-mock-extended';
import { TeamTypeService } from '../persistence/team-type.service';
import { TeamTypeImportService } from '../import/team-type-import.service';

describe('TeamTypeController', () => {
  let controller: TeamTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamTypeController],
      providers: [
        { provide: TeamTypeService, useValue: mock<TeamTypeService>() },
        {
          provide: TeamTypeImportService,
          useValue: mock<TeamTypeImportService>(),
        },
      ],
    }).compile();

    controller = module.get<TeamTypeController>(TeamTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
