import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Instructor {
  @PrimaryColumn() ID: number;

  @Column() Speciality: string;
}
