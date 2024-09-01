import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { DbconfigModule } from './dbconfig/dbconfig.module';
import { DbconfigService } from './dbconfig/dbconfig.service';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DbconfigModule], // Importa ConfigModule aquí para que el ConfigService esté disponible
      inject: [DbconfigService],
      useFactory: async (configService: DbconfigService) =>
        configService.getDatabaseConfig(),
    }),
    UsuarioModule,
    AuthModule,
    DbconfigModule,
    GptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
