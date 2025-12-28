import { Test, TestingModule } from '@nestjs/testing';
import { MatchEventConsolidatorService } from './match-event-consolidator.service';
import {
  MatchEventActionType,
  MatchEventConsequenceType,
  MatchReference,
  PlayerReference,
  TeamReference,
} from '@tloegbbl/api';
import { mock } from 'jest-mock-extended';
import { ApiUtilsService } from '../api-client/api-utils.service';

describe('MatchEventConsolidatorService', () => {
  let service: MatchEventConsolidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchEventConsolidatorService,
        { provide: ApiUtilsService, useValue: mock<ApiUtilsService>() },
      ],
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
          externalSystem: 'tloeg.bbleague.se',
        },
      ],
    };
    const teamA: TeamReference = {
      externalIds: [
        {
          externalId: 'teamA',
          externalSystem: 'tloeg.bbleague.se',
        },
      ],
    };
    const playerA1: PlayerReference = {
      externalIds: [
        {
          externalId: 'playerA1',
          externalSystem: 'tloeg.bbleague.se',
        },
      ],
    };
    const teamB: TeamReference = {
      externalIds: [
        {
          externalId: 'teamB',
          externalSystem: 'tloeg.bbleague.se',
        },
      ],
    };
    const playerB1: PlayerReference = {
      externalIds: [
        {
          externalId: 'playerB1',
          externalSystem: 'tloeg.bbleague.se',
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
              externalSystem: 'tloeg.bbleague.se',
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
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
          match: match,
          actingTeam: teamA,
          actingPlayer: playerA1,
          actionType: MatchEventActionType.MVP,
        },
      ]);
    });

    it('merges killer and death', () => {
      const result = service.consolidateMatchEvents([
        {
          externalIds: [
            {
              externalId: '1',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
          match: match,
          actingTeam: teamA,
          actingPlayer: playerA1,
          actionType: MatchEventActionType.CASUALTY,
          consequenceType: MatchEventConsequenceType.DEATH,
        },
        {
          externalIds: [
            {
              externalId: '2',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
          match: match,
          consequenceTeam: teamB,
          consequencePlayer: playerB1,
          consequenceType: MatchEventConsequenceType.DEATH,
        },
      ]);
      expect(result).toStrictEqual([
        {
          externalIds: [
            {
              externalId: '1',
              externalSystem: 'tloeg.bbleague.se',
            },
            {
              externalId: '2',
              externalSystem: 'tloeg.bbleague.se',
            },
          ],
          match: match,
          actingTeam: teamA,
          actingPlayer: playerA1,
          actionType: MatchEventActionType.CASUALTY,
          consequenceTeam: teamB,
          consequencePlayer: playerB1,
          consequenceType: MatchEventConsequenceType.DEATH,
        },
      ]);
    });
  });

  // TODO Extract helper function to create external IDs
});
