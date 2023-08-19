import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Coach {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;
}
