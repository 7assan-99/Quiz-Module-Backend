import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment') ID: number

  @Column() Name: string

  @Column() no_questions_to_appear_in_exam: number

  @Column() Created_By: number

  @CreateDateColumn() Created_On: Date

  @UpdateDateColumn() Updated_On: Date

  @Column() Updated_By?: number

  @Column() Exam_ID: string
}
