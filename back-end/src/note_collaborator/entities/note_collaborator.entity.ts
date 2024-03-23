import { Note } from "../../note/entities/note.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

export enum ShareMode {
  COMMENT = "comment",
  VIEW = "view",
  EDIT = "edit",
}

@Entity()
export class NoteCollaborator {
  @PrimaryColumn({ type: "varchar", width: 255 })
  note_id: string;

  @PrimaryColumn({ type: "varchar", width: 255 })
  email: string;

  @Column({
    type: "enum",
    enum: ShareMode,
    nullable: false,
  })
  share_mode: ShareMode;

  @ManyToOne(() => Note, (note) => note.note_collaborators, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'note_id' })
  note?: Note;
}
