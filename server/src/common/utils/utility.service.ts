import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { or, isEmpty, isNil, converge } from 'ramda';
import { unescape } from 'lodash';

@Injectable()
export class UtilityService {
  isEqual(val1, val2) {
    return val1 === val2 || val1?.toString() === val2?.toString();
  }

  /**
   * method to check for falsy values
   * @param {Empty string, Object, undfined, null}
   *
   * @returns {Boolean}
   */
  isEmptyOrNil = converge(or, [isEmpty, isNil]);

  removeTags(str: string) {
    if (this.isEmptyOrNil(str)) return '';
    else str = str.toString();

    // Regular expression to identify HTML tags in
    // replace HTML tag with a null string.
    return unescape(str.replace(/(<([^>]+)>)/gi, ''));
  }

  getUniqueIds(data: Array<any>, key: string): Array<Types.ObjectId> {
    const uniqueIds: Set<string> = new Set();
    data.forEach((obj) => uniqueIds.add(obj[key].toString()));
    const ids = [...uniqueIds];
    return ids.map((id) => new Types.ObjectId(id));
  }

  mapResponseByKey(data: Array<any>, key: string) {
    const mapResponse = new Map<string, any>();
    data.forEach((ele) => {
      mapResponse.set(ele[key].toString(), ele);
    });
    return mapResponse;
  }

  getCommonIdsFromTwoArray(
    arr1: Array<any>,
    key1: string | null,
    arr2: Array<any>,
    key2: string | null,
  ): Array<Types.ObjectId> {
    const set1: Set<string> = new Set(
      arr1.map((ele) => (key1 ? ele[key1].toString() : ele.toString())),
    );
    const set2: Set<string> = new Set(
      arr2.map((ele) => (key1 ? ele[key2].toString() : ele.toString())),
    );
    const intersectionIds: Set<string> = new Set();

    //get common id from set1 and set2
    for (const ele of set2) if (set1.has(ele)) intersectionIds.add(ele);

    //convert string to mongoId
    const ids = [...intersectionIds];
    return ids.map((id) => new Types.ObjectId(id));
  }

  checkCommonIdExist(
    arr1: Array<any>,
    key1: string | null,
    arr2: Array<any>,
    key2: string | null,
  ): boolean {
    const set1: Set<string> = new Set(
      arr1.map((ele) => (key1 ? ele[key1].toString() : ele.toString())),
    );
    const set2: Set<string> = new Set(
      arr2.map((ele) => (key2 ? ele[key2].toString() : ele.toString())),
    );

    //get common id exist or not
    for (const ele of set2) if (set1.has(ele)) return true;
    return false;
  }

  getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(yesterday);
  }
}
