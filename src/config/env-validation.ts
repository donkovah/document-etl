import { plainToInstance } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUrl, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  PORT: string = '3000';

  @IsString()
  REDIS_URL: string;

  @IsString()
  POSTGRES_URL: string;

  @IsString()
  POSTGRES_DATABASE: string;

}

export function validateEnv(config: Record<string, any>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: true,
  });

  if (errors.length > 0) {
    console.error('Invalid environment variables:');
    console.error(errors);
    process.exit(1);
  }

  return validated;
}
