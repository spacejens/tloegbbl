import { Injectable } from '@nestjs/common';
import { IdentifiablePersistenceService } from './identifiable-persistence.service';
import {
  PlayerTypeHasAdvancement,
  PlayerTypeHasAdvancementReference,
} from '@tloegbbl/api';
import { PrismaService } from './prisma.service';
import { PlayerTypeService } from './player-type.service';
import { AdvancementService } from './advancement.service';

@Injectable()
export class PlayerTypeHasAdvancementService extends IdentifiablePersistenceService<
  PlayerTypeHasAdvancementReference,
  PlayerTypeHasAdvancement
> {
  constructor(
    private prisma: PrismaService,
    private playerTypeService: PlayerTypeService,
    private advancementService: AdvancementService,
  ) {
    super(prisma.playerTypeHasAdvancement);
  }

  async findById(id: number): Promise<PlayerTypeHasAdvancement> {
    return await this.prisma.playerTypeHasAdvancement.findUnique({
      where: {
        id: id,
      },
      include: this.fieldsNeededForTheDto(),
    });
  }

  fieldsNeededForTheDto() {
    return {
      playerType: {
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
    reference: PlayerTypeHasAdvancementReference,
  ): Promise<PlayerTypeHasAdvancement> {
    if (reference.id) {
      return this.findById(reference.id);
    } else {
      const playerType = await this.playerTypeService.findByReference(
        reference.playerType,
      );
      const advancement = await this.advancementService.findByReference(
        reference.advancement,
      );
      if (playerType && advancement) {
        const results = await this.prisma.playerTypeHasAdvancement.findMany({
          where: {
            playerType: {
              id: playerType.id,
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
            `Found ${results.length} records for player type ${playerType.id} has advancement ${advancement.id}`,
          );
        }
      }
    }
    return undefined;
  }

  async create(
    input: PlayerTypeHasAdvancement,
  ): Promise<PlayerTypeHasAdvancement> {
    if (input.id) {
      throw new Error(
        `Attempting to create player type has advancement with existing ID ${input.id}`,
      );
    }
    // TODO Should get related entities to connect to in some cleaner way, using more advanced Prisma syntax
    const playerType = await this.playerTypeService.findByReference(
      input.playerType,
    );
    if (!playerType) {
      throw new Error(
        `Failed to find player type: ${JSON.stringify(input.playerType)}`,
      );
    }
    const advancement = await this.advancementService.findByReference(
      input.advancement,
    );
    if (!advancement) {
      throw new Error(
        `Failed to find advancement: ${JSON.stringify(input.advancement)}`,
      );
    }
    return await this.prisma.playerTypeHasAdvancement.create({
      data: {
        playerType: {
          connect: {
            id: playerType.id,
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

  async update(
    input: PlayerTypeHasAdvancement,
  ): Promise<PlayerTypeHasAdvancement> {
    if (!input.id) {
      throw new Error(
        `Attempting up update player type has advancement without existing ID: ${JSON.stringify(
          input,
        )}`,
      );
    }
    return await this.prisma.playerTypeHasAdvancement.update({
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
