import { Note } from '../../note/entities/note.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FavoriteNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Note, (note) => note.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  note: Note;
}
