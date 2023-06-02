import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exam {
  @PrimaryGeneratedColumn('uuid') ID?: string;

  @Column() Title: string;

  @Column() Description: string;

  @Column({ type: 'datetime' }) TimeToStart: Date;

  @Column({ type: 'datetime' }) TimeToEnd: Date;

  @Column() TimeToAttempt: number;

  @Column() NoOfAttempts: number;

  @Column({ type: 'double' }) Grade: number;

  @Column() QuestionBank?: string;

  @Column({type:'boolean',default: false}) isPublished?: Boolean;
  
  @Column() Created_By: number;

  @CreateDateColumn() Created_On: Date;

  @Column() Course_ID: string;
}
