import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Materia {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ length: 255 })
   nombre: string;

   @Column({ length: 255, nullable: true })
   descripcion: string;

   @Column()
   codigo_usuario: number;

   @ManyToOne(() => Usuario, usuario => usuario.materias, {
     onDelete: 'CASCADE',
     onUpdate: 'CASCADE'
   })
   usuario: Usuario;
}
