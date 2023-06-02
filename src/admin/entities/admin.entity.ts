import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryColumn() ID: number;

  @Column() isMasterAdmin: boolean;
}
