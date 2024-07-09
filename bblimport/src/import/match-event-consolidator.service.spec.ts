import { Test, TestingModule } from '@nestjs/testing';
import { MatchEventConsolidatorService } from './match-event-consolidator.service';
import { BblPlayerReference } from './players.service';
import { ActionType } from './matches.service';
import { TeamReference } from '../dtos';

describe('MatchEventConsolidatorService', () => {
  let service: MatchEventConsolidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchEventConsolidatorService],
    }).compile();

    service = module.get<MatchEventConsolidatorService>(MatchEventConsolidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('consolidateMatchEvents', () => {
    const teamA: TeamReference = { externalIds: [{
      externalId: 'teamA',
      externalSystem: 'test',
    }]};
    const playerA1: BblPlayerReference = { id: 'playerA1' };
    const teamB: TeamReference = { externalIds: [{
      externalId: 'teamB',
      externalSystem: 'test',
    }]};
    const playerB1: BblPlayerReference = { id: 'playerB1' };

    it('does nothing to empty set', () => {
      const result = service.consolidateMatchEvents([]);
      expect(result).toStrictEqual([]);
    });

    it('does nothing to single event', () => {
      const result = service.consolidateMatchEvents([{
        id: '1',
        actingTeam: teamA,
        actingPlayer: playerA1,
        actionType: ActionType.MVP,
      }]);
      expect(result).toStrictEqual([{
        id: '1',
        actingTeam: teamA,
        actingPlayer: playerA1,
        actionType: ActionType.MVP,
      }]);
    });
  });
});
