import { Test, TestingModule } from '@nestjs/testing';
import { CountController } from './count.controller';
import { CoachService } from './coach.service';
import { mock } from 'jest-mock-extended';

describe('CountController', () => {
  let controller: CountController;
  let coachService: CoachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CoachService, useValue: mock<CoachService>() }],
      controllers: [CountController],
    }).compile();

    controller = module.get<CountController>(CountController);
    coachService = module.get<CoachService>(CoachService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('countEverything', () => {
    it('should count every type of data', async () => {
      coachService.countCoaches = jest.fn().mockReturnValue(111);
      const result = await controller.countEverything();
      expect(result).toStrictEqual({
        coaches: 111,
      });
    });
  });
});
