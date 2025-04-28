import { SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

export const AuthThrottle = () =>
  Throttle({ default: { limit: 5, ttl: 60000 } });
