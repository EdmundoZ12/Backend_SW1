import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Usuario])],

  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports:[TypeOrmModule, UsuarioService],
})
export class UsuarioModule {}
