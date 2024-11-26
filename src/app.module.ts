import 'dotenv/config'; // Alternativamente, puedes usar require('dotenv').config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { DbconfigModule } from './dbconfig/dbconfig.module';
import { DbconfigService } from './dbconfig/dbconfig.service';
import { GptModule } from './gpt/gpt.module';
import { TemaModule } from './tema/tema.module';
import { ApunteModule } from './apunte/apunte.module';
import { EditorModule } from './websocket/editor.module';
import { ShotstackModule } from './shotstack/shotstack.module';

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
    TemaModule,
    ApunteModule,
    EditorModule,
    ShotstackModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
