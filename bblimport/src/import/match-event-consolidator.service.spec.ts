import { Test, TestingModule } from '@nestjs/testing';
import { MatchEventConsolidatorService } from './match-event-consolidator.service';
import {
  MatchEventActionType,
  MatchReference,
  PlayerReference,
  TeamReference,
} from '../dtos';

describe('MatchEventConsolidatorService', () => {
  let service: MatchEventConsolidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchEventConsolidatorService],
    }).compile();

    service = module.get<MatchEventConsolidatorService>(
      MatchEventConsolidatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('consolidateMatchEvents', () => {
    const match: MatchReference = {
      externalIds: [
        {
          externalId: 'match',
          externalSystem: 'test',
        },
      ],
    };
    const teamA: TeamReference = {
      externalIds: [
        {
          externalId: 'teamA',
          externalSystem: 'test',
        },
      ],
    };
    const playerA1: PlayerReference = {
      externalIds: [
        {
          externalId: 'playerA1',
          externalSystem: 'test',
        },
      ],
    };
    const teamB: TeamReference = {
      externalIds: [
        {
          externalId: 'teamB',
          externalSystem: 'test',
        },
      ],
    };
    const playerB1: PlayerReference = {
      externalIds: [
        {
          externalId: 'playerB1',
          externalSystem: 'test',
        },
      ],
    };

    it('does nothing to empty set', () => {
      const result = service.consolidateMatchEvents([]);
      expect(result).toStrictEqual([]);
    });

    it('does nothing to single event', () => {
      const result = service.consolidateMatchEvents([
        {
          externalIds: [
            {
              externalId: '1',
              externalSystem: 'test',
            },
          ],
          match: match,
          actingTeam: teamA,
          actingPlayer: playerA1,
          actionType: MatchEventActionType.MVP,
        },
      ]);
      expect(result).toStrictEqual([
        {
          externalIds: [
            {
              externalId: '1',
              externalSystem: 'test',
            },
          ],
          match: match,
          actingTeam: teamA,
          actingPlayer: playerA1,
          actionType: MatchEventActionType.MVP,
        },
      ]);
    });
  });
});
