import { Tag } from '../../tag/entities/tag.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'longtext' })
  title: string;

  @Index({ fulltext: true })
  @Column({ type: 'longtext', nullable: true })
  content: string;

  @Column({ type: 'int', default: 0 })
  size: number;

  @Column({ type: 'tinyint' })
  read_only: boolean;

  // @Column('uuid', { nullable: true })
  // parent_id: string;

  // @Column('uuid')
  // user_id: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @OneToMany(() => Note, (note) => note.parentNote)
  @JoinColumn({ name: 'child_notes' })
  childNotes: Note[];

  @ManyToOne(() => Note, (note) => note.childNotes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_note' })
  parentNote: Note;

  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Note, (note) => note.headlinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'links',
    joinColumn: {
      name: 'headlink_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'backlink_id',
      referencedColumnName: 'id',
    },
  })
  backlinks: Note[];

  @ManyToMany(() => Note, (note) => note.backlinks, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  headlinks: Note[];

  @ManyToMany(() => Tag, (tag) => tag.notes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tags?: Tag[];
}
