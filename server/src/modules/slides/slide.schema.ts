// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { SchemaTypes, Types } from 'mongoose';
// import { User, UserSchema } from '../users/users.schema';

// @Schema({
//   timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
//   versionKey: false,
//   collection: 'Slide',
// })
// export class Slide {
//   @Prop({typpe: SchemaTypes.String, required: true})
//   title: string;


//   // @##################


//   @Prop([{ type: SchemaTypes.Date, required: true }])
//   startTime?: Date;

//   @Prop({ type: SchemaTypes.Date })
//   endTime: Date;

//   @Prop({type: SchemaTypes.Boolean, required: false})
  

//   @Prop({ type: SchemaTypes.Date })
//   deletedAt?: Date;

//   @Prop({ type: SchemaTypes.Date })
//   modifiedAt?: Date;
// }

// export const SlideSchema = SchemaFactory.createForClass(Slide);
// export const SlideModel = mongoose.model('Slides', SlideSchema);
