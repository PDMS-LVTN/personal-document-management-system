import { Note } from '../../note/entities/note.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FileUpload {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', width: 255 })
  path: string;

  @Column('uuid')
  note_ID: string;

  @Column({ type: 'varchar', width: 255 })
  name: string;

  @ManyToOne(() => Note, (note) => note.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'note_ID' })
  note: Note;
}
