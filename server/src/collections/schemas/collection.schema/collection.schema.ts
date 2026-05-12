import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema({ _id: false })
export class Pokemon {
  @Prop({ required: true })
  id!: number;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: String, default: null })
  image!: string | null;

  @Prop({ required: true })
  weight!: number;

  @Prop({ type: [String], default: [] })
  types!: string[];
}

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Collection {
  @Prop({ required: true })
  name!: string;

  @Prop({ type: [Pokemon], required: true })
  pokemons!: Pokemon[];

  totalWeight!: number;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

CollectionSchema.virtual('totalWeight').get(function (this: Collection) {
  return this.pokemons.reduce((sum, p) => sum + p.weight, 0);
});
