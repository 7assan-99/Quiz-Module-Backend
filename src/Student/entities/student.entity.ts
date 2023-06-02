import {Entity,Column,PrimaryColumn,JoinColumn,ManyToOne} from 'typeorm'

@Entity()
export class Student{
    @PrimaryColumn() ID: number

    @Column() Major: string
}