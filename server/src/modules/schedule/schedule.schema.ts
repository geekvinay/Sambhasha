import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes, Types } from 'mongoose';

@Schema({ _id: false })
export class User {
  @Prop({ type: SchemaTypes.String, required: true })
  userName: number;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  userId: string;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  phoneNumber: string;

  @Prop({ type: SchemaTypes.String, trim: true })
  email?: number;

  @Prop({ type: SchemaTypes.String, trim: true })
  password?: number;
}
export const UserSchema = SchemaFactory.createForClass(User);

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
  collection: 'schedule',
})
export class Schedule {
  @Prop({ required: true, type: [UserSchema] })
  user: User[];

  @Prop([{ type: SchemaTypes.Date, required: true }])
  startTime?: Date;

  @Prop({ type: SchemaTypes.Date })
  endTime: Date;

  @Prop({ type: SchemaTypes.Date })
  expiryDuration?: Date;

  @Prop({ type: SchemaTypes.String, trim: true })
  scheduleId?: String;

  @Prop({ type: SchemaTypes.String, trim: true })
  scheduleName?: String;

  @Prop({ type: SchemaTypes.Date })
  deletedAt?: Date;

  @Prop({ type: SchemaTypes.Date })
  modifiedAt?: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
export const ScheduleModel = mongoose.model('Schedules', ScheduleSchema);
