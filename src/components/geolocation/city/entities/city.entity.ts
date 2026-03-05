import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GeolocationCityDocument = GeolocationCity & Document;

@Schema({ _id: false })
export class GeolocationState {
  @Prop({ required: true })
  label: string;
}

export const GeolocationStateSchema =
  SchemaFactory.createForClass(GeolocationState);

@Schema({
  timestamps: true,
})
export class GeolocationCity {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  dane: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: GeolocationState, required: true })
  state: GeolocationState;
}

export const GeolocationCitySchema =
  SchemaFactory.createForClass(GeolocationCity);
