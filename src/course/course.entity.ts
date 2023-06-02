import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid') ID: string

  @Column() Name: string

  @Column() Description: string

  @Column() Created_By: number

  @CreateDateColumn() Created_On: Date
}
