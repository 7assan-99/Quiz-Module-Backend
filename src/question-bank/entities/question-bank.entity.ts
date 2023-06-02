import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuestionBank {
  @PrimaryGeneratedColumn('uuid') ID?: string;

  @Column() Title: string;

}
