import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes, Types } from 'mongoose';
import { User, UserSchema } from '../users/users.schema';

export class roomCodes {
  @Prop({ type: SchemaTypes.String })
  code: string;

  @Prop({ type: SchemaTypes.String })
  role: string;
}

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
  collection: 'schedule',
})
export class Schedule {
  @Prop({ required: true, type: [UserSchema] })
  user: User[];

  @Prop({ type: SchemaTypes.String })
  uniqueCode: string;

  @Prop([{ type: SchemaTypes.Date, required: true }])
  startTime?: Date;

  @Prop({ type: SchemaTypes.Date })
  endTime: Date;

  @Prop({ type: SchemaTypes.Array })
  roomCodes: roomCodes;

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
ScheduleSchema.index({ uniqueCode: 1 }, { unique: true });
export const ScheduleModel = mongoose.model('Schedules', ScheduleSchema);