import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function AuthJWTSwaggerDoc() {
  return applyDecorators(
    ApiBearerAuth('token'),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
