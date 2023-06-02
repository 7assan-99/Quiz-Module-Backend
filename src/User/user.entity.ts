import {Entity,Column,PrimaryColumn, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User{
    @PrimaryColumn() ID: number

    @Column() Email: string

    @Column() Name: string

    @Column() Password: string

}