import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tema } from './entities/tema.entity';
import { Not, Repository } from 'typeorm';
import { MateriaService } from 'src/materia/materia.service';
import { ApunteService } from 'src/apunte/apunte.service';

@Injectable()
export class TemaService {
  constructor(
    @InjectRepository(Tema) private readonly temaRepository: Repository<Tema>,
    private readonly materiaService: MateriaService,
    private readonly apunteService: ApunteService
  ) {}

  async createTema(createTemaDto: CreateTemaDto) {
    const { nombre, materiaId, temaPadreId } = createTemaDto;

    const materia = await this.materiaService.findOne(materiaId);
    if (!materia)
      throw new HttpException('Materia no encontrada', HttpStatus.NOT_FOUND);

    let temaPadre = null;
    if (temaPadreId) {
      temaPadre = await this.temaRepository.findOne({
        where: { id: temaPadreId },
      });
      if (!temaPadre)
        throw new HttpException(
          'Tema padre no encontrado',
          HttpStatus.NOT_FOUND,
        );
    }

    const existingTema = await this.temaRepository.findOne({
      where: { nombre, materia, temaPadre },
    });
    if (existingTema)
      throw new HttpException(
        'Tema ya existe en este nivel',
        HttpStatus.CONFLICT,
      );

    const newTema = this.temaRepository.create({ nombre, materia, temaPadre });
    return this.temaRepository.save(newTema);
  }

  async findAllByMateria(materiaId: number) {
    const materia = await this.materiaService.findOne(materiaId);
    if (!materia)
      throw new HttpException('Materia no encontrada', HttpStatus.NOT_FOUND);

    return this.temaRepository
      .createQueryBuilder('tema')
      .where('tema.materiaId = :materiaId', { materiaId })
      .andWhere('tema.temaPadreId IS NULL') // Solo temas raíz
      .getMany();
  }

  async findOneWithSubTemas(id: number) {
    const tema = await this.temaRepository.findOne({
      where: { id },
      relations: ['subTemas', 'temaPadre', 'materia', 'subTemas.subTemas'],
    });
    if (!tema)
      throw new HttpException('Tema no encontrado', HttpStatus.NOT_FOUND);
    return tema;
  }

  async update(id: number, updateTemaDto: UpdateTemaDto) {
    const tema = await this.findOneWithSubTemas(id);
    if (!tema)
      throw new HttpException('Tema no encontrado', HttpStatus.NOT_FOUND);

    const { nombre, temaPadreId } = updateTemaDto;

    const existingTema = await this.temaRepository.findOne({
      where: {
        nombre,
        materia: tema.materia,
        temaPadre: temaPadreId ? { id: temaPadreId } : null,
        id: Not(id), // Excluye el tema que se está actualizando
      },
    });

    if (existingTema)
      throw new HttpException(
        'Ya existe un tema con este nombre en el mismo nivel',
        HttpStatus.CONFLICT,
      );

    Object.assign(tema, updateTemaDto);
    return this.temaRepository.save(tema);
  }

  async remove(id: number) {
    const tema = await this.findOneWithSubTemas(id);
    if (!tema)
      throw new HttpException('Tema no encontrado', HttpStatus.NOT_FOUND);

    await this.temaRepository.delete(id);
    return { message: 'Tema eliminado exitosamente' };
  }

  private async findOne(id: number) {
    const tema = this.temaRepository.findOneBy({ id: id });
    if (!tema)
      throw new HttpException('Tema no encontrado', HttpStatus.NOT_FOUND);
    return tema;
  }

  async getApuntesByTema(id: number) {
    const tema = await this.findOne(id);
    
    return this.apunteService.findByTemaId(tema.id);
  }
}
