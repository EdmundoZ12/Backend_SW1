import { Module } from '@nestjs/common';
import { TemaService } from './tema.service';
import { TemaController } from './tema.controller';
import { MateriaModule } from 'src/materia/materia.module';
import { Tema } from './entities/tema.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tema]), MateriaModule],
  controllers: [TemaController],
  providers: [TemaService],
})
export class TemaModule {}
