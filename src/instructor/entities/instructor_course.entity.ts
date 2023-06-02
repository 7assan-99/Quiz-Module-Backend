import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Instructor_Course {
  @PrimaryColumn() I_ID: number;

  @PrimaryColumn() C_ID: string;
}
