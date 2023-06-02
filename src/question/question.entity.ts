import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum QuestionType{
    MCQ = "mcq",
    SHORTANSWER = "sa",
    CODE = "code"
}

@Entity()
export class Question{
    @PrimaryGeneratedColumn('uuid') ID: string

    @Column() Question: string

    @Column() Question_Type: string

    @Column({nullable: true}) functionName?: string

    @Column({type:'json',nullable: true}) Choices?: {}

    @Column({type:'json', nullable: true}) Answer?: {}

    @Column({type:'double'}) Points: number

    @Column() Created_By: number

    @CreateDateColumn() Created_On: Date

    @Column() Updated_By?: number

    @UpdateDateColumn() Updated_On: Date

    @Column({nullable: true}) testFilePath?: string;

    @Column() C_ID: number

    @Column() QB_ID: string

}