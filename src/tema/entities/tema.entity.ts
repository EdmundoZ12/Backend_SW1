import { Materia } from 'src/materia/entities/materia.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tema')
export class Tema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  nombre: string;

  @ManyToOne(() => Materia, (materia) => materia.temas)
  materia: Materia;

  @ManyToOne(() => Tema, (tema) => tema.subTemas, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  temaPadre: Tema;

  @OneToMany(() => Tema, (tema) => tema.temaPadre)
  subTemas: Tema[];
}
