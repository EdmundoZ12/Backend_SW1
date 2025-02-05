import { Module } from '@nestjs/common';
import { ApunteService } from './apunte.service';
import { ApunteController } from './apunte.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apunte } from './entities/apunte.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Tema } from '../tema/entities/tema.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apunte, Materia, Tema, Usuario])],
  controllers: [ApunteController],
  providers: [ApunteService],
  exports: [ApunteService],
})
export class ApunteModule {}
