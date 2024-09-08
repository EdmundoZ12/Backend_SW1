import { Materia } from 'src/materia/entities/materia.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
 // Asegúrate de que la ruta sea correcta

@Entity()
export class Usuario {
   @PrimaryGeneratedColumn()
   codigo: number;
   
   @Column({ length: 255 })
   nombre: string;

   @Column({ length: 255, nullable: true })
   apellido: string;

   @Column({ length: 255 })
   email: string;

   @Column({ length: 255 })
   password: string;

   @Column({ length: 255, nullable: true })
   telefono: string;

   @OneToMany(() => Materia, materia => materia.usuario)
   materias: Materia[];
}
