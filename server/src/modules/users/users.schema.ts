import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { SchemaTypes, Types } from 'mongoose';

@Schema({ _id: true })
export class User {
  @Prop({ type: SchemaTypes.String, required: true })
  userName: string;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  phoneNumber: string;

  @Prop({ type: SchemaTypes.String, trim: true })
  email?: string;

  @Prop({ type: SchemaTypes.String, trim: true })
  password?: string;

  @Prop({ type: SchemaTypes.ObjectId, trim: true })
  roleId?: Types.ObjectId;
}
export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = mongoose.model('Users', UserSchema);

UserSchema.index({ userName: 1, email: 1, phoneNumber: 1 }, { name: "userName_1_email_1_phoneNumber_1" });