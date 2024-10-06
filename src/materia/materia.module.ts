import { Module } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { Materia } from './entities/materia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Materia]), UsuarioModule],
  controllers: [MateriaController],
  providers: [MateriaService],
  exports: [MateriaService],
})
export class MateriaModule {}
