import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ExamAttempt_Question{
   @PrimaryColumn() ExamAttempt_ID: string
   @PrimaryColumn() Question_ID: string
}