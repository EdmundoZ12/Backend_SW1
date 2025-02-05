import { IsOptional } from 'class-validator';
import { Apuntecompartido } from 'src/apuntescompartido/entities/apuntecompartido.entity';
import { Materia } from 'src/materia/entities/materia.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  apellido: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({nullable: true})
  @IsOptional()
  tokenDevice?: string;

  @Column({ length: 255, nullable: true })
  telefono: string;

  @OneToMany(() => Materia, (materia) => materia.usuario)
  materias: Materia[];

  @OneToMany(() => Apuntecompartido, (compartido) => compartido.usuario)
  apuntescompartidos: Apuntecompartido[];
}
