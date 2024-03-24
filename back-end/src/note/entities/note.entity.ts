import { NoteCollaborator } from "../../note_collaborator/entities/note_collaborator.entity";
import { FileUpload } from "../../file_upload/entities/file_upload.entity";
import { ImageContent } from "../../image_content/entities/image_content.entity";
import { Tag } from "../../tag/entities/tag.entity";
import { User } from "../../user/entities/user.entity";
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
  Tree,
  ChildEntity,
  TreeChildren,
  TreeParent,
} from "typeorm";

@Entity()
@Tree("closure-table")
export class Note {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ fulltext: true })
  @Column({ type: "longtext" })
  title: string;

  @Index({ fulltext: true })
  @Column({ type: "longtext", nullable: true })
  content: string;

  @Column({ type: "int", default: 0 })
  size: number;

  @Column({ type: "tinyint", nullable: true })
  read_only: boolean;

  @Column({ type: "tinyint", nullable: true })
  is_pinned: boolean;

  @Column({ type: "tinyint", nullable: true })
  is_favorited: boolean;

  @Column({ type: "tinyint", nullable: true })
  is_anyone: boolean;

  @Column("uuid", { nullable: true })
  parent_id: string;

  @Column("uuid")
  user_id: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  // @OneToMany(() => Note, (note) => note.parentNote, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  @TreeChildren()
  childNotes: Note[];

  @ManyToOne(() => Note, (note) => note.childNotes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "parent_id" })
  @TreeParent()
  parentNote: Note;

  @ManyToOne(() => User, (user) => user.notes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToMany(() => Note, (note) => note.headlinks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinTable({
    name: "links",
    joinColumn: {
      name: "headlink_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "backlink_id",
      referencedColumnName: "id",
    },
  })
  backlinks: Note[];

  @ManyToMany(() => Note, (note) => note.backlinks, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  headlinks: Note[];

  @ManyToMany(() => Tag, (tag) => tag.notes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  tags?: Tag[];

  @OneToMany(() => ImageContent, (image_content) => image_content.note, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  image_contents?: ImageContent[];

  @OneToMany(() => FileUpload, (file_upload) => file_upload.note, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  file_uploads?: FileUpload[];

  @OneToMany(
    () => NoteCollaborator,
    (note_collaborator) => note_collaborator.note,
    {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      nullable: true,
    },
  )
  note_collaborators?: NoteCollaborator[];
}
