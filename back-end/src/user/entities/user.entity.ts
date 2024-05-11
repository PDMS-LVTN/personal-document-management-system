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

  @Column({ type: 'tinyint', default: false })
  isEmailConfirmed: boolean;

  @Column({ type: 'varchar', width: 255, default: null })
  codeEmailConfirmed: string;

  @Column({ type: 'varchar', width: 255, default: null })
  resetPasswordToken: string;

  @OneToMany(() => Note, (note) => note.user, { eager: true})
  notes: Note[];

  constructor(private item: Partial<User>) {
    Object.assign(this, item);
    // this. = item;
  }
}
