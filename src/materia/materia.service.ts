import { Injectable } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './entities/materia.entity';


@Injectable()
export class MateriaService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
  ) {}

  async create(createMateriaDto: CreateMateriaDto): Promise<Materia> {
    const materia = this.materiaRepository.create(createMateriaDto);
    return this.materiaRepository.save(materia);
  }

  async findAll(): Promise<Materia[]> {
    return this.materiaRepository.find();
  }

  async findOne(id: number): Promise<Materia> {
    return this.materiaRepository.findOneBy({id:id});
  }

  async update(id: number, updateMateriaDto: UpdateMateriaDto): Promise<Materia> {
    await this.materiaRepository.update(id, updateMateriaDto);
    return this.materiaRepository.findOneBy({id:id});
  }

  async remove(id: number): Promise<void> {
    await this.materiaRepository.delete(id);
  }
}
