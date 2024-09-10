import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Materia } from '../../materia/entities/materia.entity';
import { Tema } from '../../tema/entities/tema.entity';

@Entity()
export class Apunte {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @ManyToOne(() => Materia, (materia) => materia.apuntes, { nullable: false })
  materia: Materia;

  @ManyToOne(() => Tema, (tema) => tema.apuntes, { nullable: false })
  tema: Tema;
}
