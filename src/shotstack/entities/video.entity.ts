import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  shotstackId: string;

  @Column({ nullable: true })
  url: string;

  @Column({
    type: 'enum',
    enum: ['queued', 'rendering', 'done', 'failed'],
    default: 'queued'
  })
  status: string;

  @Column('json')
  data: any;

  @CreateDateColumn()
  createdAt: Date;
}