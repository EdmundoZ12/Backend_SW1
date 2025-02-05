import { Module } from '@nestjs/common';
import { Apuntecompartido } from './entities/apuntecompartido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApuntecompartidoService } from './apuntescompartido.service';
import { ApuntecompartidoController } from './apuntescompartido.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forFeature([Apuntecompartido]), UsuarioModule],
  controllers: [ApuntecompartidoController],
  providers: [ ApuntecompartidoService],
})
export class ApuntecompartidoModule {}
