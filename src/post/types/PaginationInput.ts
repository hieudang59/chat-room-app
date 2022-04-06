import { Field, InputType, Int } from 'type-graphql';

@InputType()
class PaginationInput {
  @Field(() => Int, { nullable: true })
  first?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}

export { PaginationInput };
