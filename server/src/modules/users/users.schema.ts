import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes, Types } from 'mongoose';

@Schema({ _id: false })
export class User {
  @Prop({ type: SchemaTypes.String, required: true })
  userName: number;

  @Prop({ type: SchemaTypes.ObjectId, required: true, trim: true })
  userId: string;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  phoneNumber: string;

  @Prop({ type: SchemaTypes.String, trim: true })
  email?: number;

  @Prop({ type: SchemaTypes.String, trim: true })
  password?: number;

  @Prop({ type: SchemaTypes.ObjectId, trim: true })
  roleId?: Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(User);