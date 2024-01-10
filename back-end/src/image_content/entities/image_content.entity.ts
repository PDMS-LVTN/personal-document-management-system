import { Note } from '../../note/entities/note.entity';
import {
  Column,
  Entity,
  Index,
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

  @Index({ fulltext: true })
  @Column({ type: 'longtext' })
  content: string;

  // @Column('uuid')
  // note_ID: string;

  @OneToOne(() => Note, (note) => note.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'note_ID'})
  note: Note;
}
