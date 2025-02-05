import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApunteDto } from './dto/create-apunte.dto';
import { UpdateApunteDto } from './dto/update-apunte.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apunte } from './entities/apunte.entity';
import { Materia } from '../materia/entities/materia.entity';
import { Tema } from '../tema/entities/tema.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class ApunteService {
  constructor(
    @InjectRepository(Apunte)
    private readonly apunteRepository: Repository<Apunte>,
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(Tema)
    private readonly temaRepository: Repository<Tema>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<Apunte[]> {
    return this.apunteRepository.find({ relations: ['materia', 'tema'] });
  }

  async findOne(id: number): Promise<Apunte> {
    const apunte = await this.apunteRepository.findOne({
      where: { id },
      relations: ['materia', 'tema'],
    });
    if (!apunte) throw new NotFoundException(`Apunte #${id} not found`);
    return apunte;
  }

  async create(createApunteDto: CreateApunteDto): Promise<Apunte> {
    let materia = null;
    let tema = null;

    // Verificamos que no se estén pasando ambos (materiaId y temaId) al mismo tiempo.
    if (createApunteDto.materiaId && createApunteDto.temaId) {
      throw new BadRequestException(
        'No puede proporcionar ambos "materiaId" y "temaId" al mismo tiempo.',
      );
    }

    // Verificamos que al menos uno esté presente.
    if (!createApunteDto.materiaId && !createApunteDto.temaId) {
      throw new BadRequestException(
        'Debe proporcionar "materiaId" o "temaId", al menos uno.',
      );
    }

    // Verificamos si viene materiaId y que sea válido
    if (createApunteDto.materiaId) {
      materia = await this.materiaRepository.findOneBy({
        id: createApunteDto.materiaId,
      });
      if (!materia) throw new NotFoundException('Materia not found');
    }

    // Verificamos si viene temaId y que sea válido
    if (createApunteDto.temaId) {
      tema = await this.temaRepository.findOneBy({
        id: createApunteDto.temaId,
      });
      if (!tema) throw new NotFoundException('Tema not found');
    }

    // Lógica para verificar que pertenezca a uno solo, no ambos
    if (!materia && !tema) {
      throw new NotFoundException('Debe proporcionar "materiaId" o "temaId"');
    }
    // Creamos el apunte con la relación a Materia o Tema y contenido
    const apunte = this.apunteRepository.create({
      titulo: createApunteDto.titulo,
      materia,
      tema,
      contenido: createApunteDto.contenido, // Asignar el contenido recibido
    });

    return this.apunteRepository.save(apunte);
  }

  async update(id: number, updateApunteDto: UpdateApunteDto): Promise<Apunte> {
    const apunte = await this.findOne(id);

    if (updateApunteDto.titulo) {
      apunte.titulo = updateApunteDto.titulo;
    }

    if (updateApunteDto.materiaId) {
      const materia = await this.materiaRepository.findOneBy({
        id: updateApunteDto.materiaId,
      });
      if (!materia) throw new NotFoundException('Materia not found');
      apunte.materia = materia;
    }

    if (updateApunteDto.temaId) {
      const tema = await this.temaRepository.findOneBy({
        id: updateApunteDto.temaId,
      });
      if (!tema) throw new NotFoundException('Tema not found');
      apunte.tema = tema;
    }

    // **Actualizar el contenido**
    if (updateApunteDto.contenido) {
      apunte.contenido = updateApunteDto.contenido;
    }

    return this.apunteRepository.save(apunte);
  }

  async remove(id: number): Promise<void> {
    const apunte = await this.findOne(id);
    await this.apunteRepository.remove(apunte);
  }

  async findByTemaId(id: number) {
    return this.apunteRepository.find({
      where: {
        tema: { id },
      },
      // relations: ['tema'], // Incluye la relación si quieres los datos del tema junto con los apuntes
    });
  }

  async findByUserEmail(email: string): Promise<Apunte[]> {
    // Primero buscamos al usuario por email
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: [
        'materias',
        'materias.apuntes',
        'materias.temas',
        'materias.temas.apuntes',
      ],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    // Inicializamos un array para almacenar todos los apuntes
    let todosLosApuntes: Apunte[] = [];

    // Recopilamos apuntes de materias
    for (const materia of usuario.materias) {
      // Agregamos apuntes directamente asociados a la materia
      if (materia.apuntes) {
        todosLosApuntes = [...todosLosApuntes, ...materia.apuntes];
      }

      // Agregamos apuntes de los temas de la materia
      if (materia.temas) {
        for (const tema of materia.temas) {
          if (tema.apuntes) {
            todosLosApuntes = [...todosLosApuntes, ...tema.apuntes];
          }
        }
      }
    }

    // Eliminamos posibles duplicados basándonos en el ID del apunte
    const apuntesUnicos = Array.from(
      new Map(todosLosApuntes.map((item) => [item.id, item])).values(),
    );

    return apuntesUnicos;
  }
}
