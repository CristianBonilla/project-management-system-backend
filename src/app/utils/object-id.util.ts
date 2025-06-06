import { Types } from 'mongoose';

type ObjectIdValue = Parameters<typeof Types.ObjectId.isValid>[0];

export const ObjectIdIsValid = (source: ObjectIdValue) => Types.ObjectId.isValid(source);
