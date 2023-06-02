import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Exam_Attempt {

  @PrimaryGeneratedColumn('uuid') ID: string
  
  @Column() Exam_ID: string

  @Column() Student_ID: number

  @CreateDateColumn() StartTime: Date

  @Column('datetime') TimeToEnd: Date

  @Column({nullable: true}) FinishTime?: Date

  @Column({type:'double',default: 0.0}) Score?: number

  @Column({type:'boolean',default:false}) isPublished: Boolean

  @Column({type:'boolean',default:false}) isFeedbackAllowed: Boolean
}