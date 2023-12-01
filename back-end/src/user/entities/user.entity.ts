// import { Note } from 'src/note/entities/note.entity';
import { IsEmail } from 'class-validator';
import { Note } from '../../note/entities/note.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column({ type: 'varchar', width: 255 })
  email: string;

  @Column({ type: 'varchar', width: 255 })
  password: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  constructor(private item: Partial<User>) {
    Object.assign(this, item);
    // this. = item;
  }
}
