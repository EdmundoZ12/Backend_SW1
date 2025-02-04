import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apuntecompartido } from './entities/apuntecompartido.entity';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UpdateApuntescompartidoDto } from './dto/update-apuntescompartido.dto';
import { CreateApunteCompartidoDto } from './dto/create-apuntecompartido.dto';

@Injectable()
export class ApuntecompartidoService {
  constructor(
    @InjectRepository(Apuntecompartido)
    private compartidoRepository: Repository<Apuntecompartido>,
    private usuarioService: UsuarioService,
  ) {}

  async create(createApuntescompartidoDto: CreateApunteCompartidoDto) {
    const usuario = await this.usuarioService.findOne(
      createApuntescompartidoDto.usuarioId,
    );
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const apunteCompartido = this.compartidoRepository.create({
      nombreApunte: createApuntescompartidoDto.nombre_apunte,
      url: createApuntescompartidoDto.url,
      usuario: usuario,
    });

    return this.compartidoRepository.save(apunteCompartido);
  }

  findAll(): Promise<Apuntecompartido[]> {
    return this.compartidoRepository.find({
      relations: ['usuario'],
    });
  }

  findOne(id: number): Promise<Apuntecompartido> {
    return this.compartidoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
  }

  async findByUsuario(usuarioId: number): Promise<Apuntecompartido[]> {
    return this.compartidoRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });
  }

  async update(
    id: number,
    updateApuntescompartidoDto: UpdateApuntescompartidoDto,
  ) {
    const apunteCompartido = await this.findOne(id);
    if (!apunteCompartido) {
      throw new Error('Apunte compartido no encontrado');
    }

    if (updateApuntescompartidoDto.usuarioId) {
      const usuario = await this.usuarioService.findOne(
        updateApuntescompartidoDto.usuarioId,
      );
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      apunteCompartido.usuario = usuario;
    }

    Object.assign(apunteCompartido, updateApuntescompartidoDto);
    return this.compartidoRepository.save(apunteCompartido);
  }

  async remove(id: number): Promise<void> {
    await this.compartidoRepository.delete(id);
  }

  async getApunCompByUser(email: string): Promise<Apuntecompartido[]> {
    try {
      const usuario = await this.usuarioService.getUsuariobyEmail(email);

      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      const apuntes = await this.compartidoRepository.find({
        where: { usuario: { id: usuario.id } },
        relations: ['usuario'],
      });

      return apuntes;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener los apuntes compartidos',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
