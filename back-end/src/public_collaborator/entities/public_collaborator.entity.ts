import { Note } from "../../note/entities/note.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class PublicCollaborator {
    @PrimaryColumn({ type: "varchar", width: 255 })
    note_id: string;

    @PrimaryColumn({ type: "varchar", width: 255 })
    email: string;

    @ManyToOne(() => Note, (note) => note.public_collaborators, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'note_id' })
    note?: Note;
}
