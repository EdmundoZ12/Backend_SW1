import { Tema } from 'src/tema/entities/tema.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Apunte } from '../../apunte/entities/apunte.entity';

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  // @Column()
  // codigo_usuario: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.materias, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  usuario: Usuario;

  @OneToMany(() => Tema, (tema) => tema.materia)
  temas: Tema[];

  @OneToMany(() => Apunte, (apunte) => apunte.materia)
  apuntes: Apunte[];
}
