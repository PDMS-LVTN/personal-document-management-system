import { Note } from '../../note/entities/note.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ImageContent {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', width: 255 })
  path: string;

  @Column({ type: 'longtext' })
  content: string;

  @OneToOne(() => Note, (note) => note.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'note_ID', referencedColumnName: 'id' })
  note: Note;
}
