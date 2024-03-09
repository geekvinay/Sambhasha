import { HttpException } from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';
import { Params } from './base-repository/interfaces';

class ParamsHelper {
  constructor() {}

  getParams<T>(fields: any): Params<T> {
    return {
      searchParams: fields,
      isLean: true,
    };
  }

  equalId(id1: string | Types.ObjectId, id2: string | Types.ObjectId): boolean {
    return id1?.toString() === id2?.toString();
  }

  id(id: string) {
    if (!isValidObjectId(id)) throw new HttpException('Invalid mongo id', 400);
    return new Types.ObjectId(id);
  }
}

export default ParamsHelper;
