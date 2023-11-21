import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  constructor(private item: Partial<User>) {
    Object.assign(this, item);
    // this. = item;
  }
}
