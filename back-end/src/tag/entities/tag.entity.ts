import { User } from 'src/user/entities/user.entity';
import { Note } from '../../note/entities/note.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', width: 255 })
  description: string;

  // @Column({ type: 'varchar', width: 36 })
  // note_ID: string;

  // @Column({ type: 'varchar', width: 36 })
  // user_ID: string;

  @ManyToMany(() => Note, (note) => note.tags, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'applies',
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'note_id',
      referencedColumnName: 'id',
    },
  })
  notes?: Note[];
}
