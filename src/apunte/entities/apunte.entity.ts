import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Materia } from '../../materia/entities/materia.entity';
import { Tema } from '../../tema/entities/tema.entity';
import { CrudArchivo } from 'src/archivo/crud_archivo/entities/crud_archivo.entity';

@Entity()
export class Apunte {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @OneToMany(()=> CrudArchivo,(archivo)=> archivo.apunte)
  archivos:CrudArchivo[];

  @ManyToOne(() => Materia, (materia) => materia.apuntes, { nullable: true })
  materia: Materia;

  @ManyToOne(() => Tema, (tema) => tema.apuntes, { nullable: true })
  tema: Tema;
}
