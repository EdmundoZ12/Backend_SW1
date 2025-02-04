import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Apuntecompartido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombreApunte: string;

  @Column()
  url: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.apuntescompartidos)
  usuario: Usuario;
}
