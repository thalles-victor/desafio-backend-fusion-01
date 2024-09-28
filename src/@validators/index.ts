import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginationFlexibleType } from 'src/@types';

export function validatePagination(pagination: PaginationFlexibleType) {
  const takeNumber = Number(pagination.take);
  const skipNumber = Number(pagination.skip);

  if (isNaN(takeNumber) || takeNumber < 0) {
    throw new BadRequestException(
      'Invalid value for "take". It should be a positive number.',
    );
  }

  if (isNaN(skipNumber) || skipNumber < 0) {
    throw new BadRequestException(
      'Invalid value for "skip". It should be a positive number.',
    );
  }

  const validTake = Math.min(takeNumber || 10, 100); // Limite máximo para "take"
  const validSkip = skipNumber || 0;

  return {
    take: validTake,
    skip: validSkip,
  };
}

export function splitKeyAndValue<T>(object: T) {
  const [key, value] = Object.entries(object)[0];

  if (!key || (!value && value !== 0)) {
    throw new InternalServerErrorException();
  }

  return [key, value];
}
