import { Test, TestingModule } from '@nestjs/testing';
import { RawDataController } from './raw-data.controller';
import { CoachService } from './coach.service';
import { mock } from 'jest-mock-extended';

describe('RawDataController', () => {
  let controller: RawDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawDataController],
      providers: [{ provide: CoachService, useValue: mock<CoachService>() }],
    }).compile();

    controller = module.get<RawDataController>(RawDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
