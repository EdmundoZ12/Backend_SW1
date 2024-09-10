import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './entities/materia.entity';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class MateriaService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    private userService: UsuarioService,
  ) {}

  async create(createMateriaDto: CreateMateriaDto): Promise<Materia> {
    const usuario = await this.userService.findOne(
      createMateriaDto.codigo_usuario,
    );

    if (!usuario) {
      throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    }
    const materia = this.materiaRepository.create({
      nombre: createMateriaDto.nombre,
      descripcion: createMateriaDto.descripcion,
      usuario: usuario,
    });
    return this.materiaRepository.save(materia);
  }

  async findAll(): Promise<Materia[]> {
    return this.materiaRepository.find();
  }

  async findOne(id: number): Promise<Materia> {
    return this.materiaRepository.findOneBy({ id: id });
  }

  async update(
    id: number,
    updateMateriaDto: UpdateMateriaDto,
  ): Promise<Materia> {
    await this.materiaRepository.update(id, updateMateriaDto);
    return this.materiaRepository.findOneBy({ id: id });
  }

  async remove(id: number): Promise<void> {
    await this.materiaRepository.delete(id);
  }
}
