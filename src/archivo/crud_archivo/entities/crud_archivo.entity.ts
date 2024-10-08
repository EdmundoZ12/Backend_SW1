
import { Apunte } from "src/apunte/entities/apunte.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CrudArchivo {
   @PrimaryGeneratedColumn()
   id:number;

   @Column({length:255})
   nombre:string;

   @Column({type:'date'})
   fecha:Date;

   @Column({length:500})
   url:string;

   @ManyToOne(()=> Apunte , (apunte)=> apunte.archivos, {nullable:true,onDelete:'CASCADE',onUpdate:'CASCADE'})
   apunte:Apunte;
   
}
