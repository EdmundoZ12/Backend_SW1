import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
   @PrimaryGeneratedColumn()
   codigo:number;
   
   @Column({length:255})
   nombre:string;

   @Column({length:255,nullable:true})
   apellido:string;

   @Column({length:255})
   email:string;

   @Column({length:255})
   password:string

   @Column({length:255,nullable:true})
   telefono:string;




}
