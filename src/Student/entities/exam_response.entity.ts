import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Exam_Response{

    @PrimaryColumn() ExamAttempt_ID: string

    @PrimaryColumn() Question_ID: string

    @Column({type:'json',nullable: true}) Student_Answer?: JSON

    @Column({nullable: true}) codeFilePath?: string

    @Column({type:'double'}) PointsEarned: number
}