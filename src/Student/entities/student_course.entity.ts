import {  Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Student_Course{
    @PrimaryColumn() S_ID: number

    @PrimaryColumn() C_ID: string
}