import { Module } from '@nestjs/common';
import { ApunteService } from './apunte.service';
import { ApunteController } from './apunte.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apunte } from './entities/apunte.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Tema } from '../tema/entities/tema.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apunte, Materia, Tema])],
  controllers: [ApunteController],
  providers: [ApunteService],
})
export class ApunteModule {}
