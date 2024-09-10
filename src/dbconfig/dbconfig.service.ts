import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DbconfigService {
  constructor() {}

  get(key: string): string | undefined {
    return process.env[key];
  }

  getDatabaseConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.get('POSTGRES_HOST'),
      port: parseInt(this.get('POSTGRES_PORT'), 10) || 5432,
      username: this.get('POSTGRES_USER'),
      password: this.get('POSTGRES_PASSWORD'),
      database: this.get('POSTGRES_DATABASE'),
      synchronize: this.get('EJECUTAR_MIGRACIONES') === 'true',
      logging: true, // logging habilitado en desarrollo
      entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Asegúrate de que las entidades estén bien configuradas
    };
  }
}
