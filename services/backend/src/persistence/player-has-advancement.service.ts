import { Injectable } from '@nestjs/common';
import { IdentifiablePersistenceService } from './identifiable-persistence.service';
import { PlayerHasAdvancement, PlayerHasAdvancementReference } from '@tloegbbl/api';
import { PrismaService } from './prisma.service';
import { PlayerService } from './player.service';
import { AdvancementService } from './advancement.service';

@Injectable()
export class PlayerHasAdvancementService extends IdentifiablePersistenceService<
  PlayerHasAdvancementReference,
  PlayerHasAdvancement
> {
  constructor(
    private prisma: PrismaService,
    private playerService: PlayerService,
    private advancementService: AdvancementService,
  ) {
    super(prisma.playerHasAdvancement);
  }

  async findById(id: number): Promise<PlayerHasAdvancement> {
    return await this.prisma.playerHasAdvancement.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  fieldsNeededForTheDto() {
    return {
      player: {
        include: {
          externalIds: true,
        },
      },
      advancement: {
        include: {
          externalIds: true,
        },
      },
    };
  }

  async findByReference(
    reference: PlayerHasAdvancementReference,
  ): Promise<PlayerHasAdvancement> {
    if (reference.id) {
      return this.findById(reference.id);
    } else {
      const player = await this.playerService.findByReference(reference.player);
      const advancement = await this.advancementService.findByReference(
        reference.advancement,
      );
      if (player && advancement) {
        const results = await this.prisma.playerHasAdvancement.findMany({
          where: {
            player: {
              id: player.id,
            },
            advancement: {
              id: advancement.id,
            },
          },
          include: this.fieldsNeededForTheDto(),
        });
        if (results.length == 1) {
          return results[0];
        } else if (results.length > 1) {
          throw new Error(
            `Found ${results.length} records for player ${player.id} has advancement ${advancement.id}`,
          );
        }
      }
    }
    return undefined;
  }

  async create(input: PlayerHasAdvancement): Promise<PlayerHasAdvancement> {
    if (input.id) {
      throw new Error(
        `Attempting to create player has advancement with existing ID ${input.id}`,
      );
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const player = await this.playerService.findByReference(input.player);
    if (!player) {
      throw new Error(`Failed to find player: ${JSON.stringify(input.player)}`);
    }
    const advancement = await this.advancementService.findByReference(
      input.advancement,
    );
    if (!advancement) {
      throw new Error(
        `Failed to find advancement: ${JSON.stringify(input.advancement)}`,
      );
    }
    return await this.prisma.playerHasAdvancement.create({
      data: {
        player: {
          connect: {
            id: player.id,
          },
        },
        advancement: {
          connect: {
            id: advancement.id,
          },
        },
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  async update(input: PlayerHasAdvancement): Promise<PlayerHasAdvancement> {
    if (!input.id) {
      throw new Error(
        `Attempting up update player has advancement without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    return await this.prisma.playerHasAdvancement.update({
      where: {
        id: input.id,
      },
      data: {
        // TODO Actually update some fields when there are fields that can be updated
      },
      include: this.fieldsNeededForTheDto(),
    });
  }
}
