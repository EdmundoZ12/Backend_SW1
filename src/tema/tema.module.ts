import { Module } from '@nestjs/common';
import { TemaService } from './tema.service';
import { TemaController } from './tema.controller';
import { MateriaModule } from 'src/materia/materia.module';
import { Tema } from './entities/tema.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApunteModule } from 'src/apunte/apunte.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tema]), MateriaModule, ApunteModule],
  controllers: [TemaController],
  providers: [TemaService],
})
export class TemaModule {}
