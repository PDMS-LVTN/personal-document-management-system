import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ShareMode } from "../entities/note_collaborator.entity";

export class CreateNoteCollaboratorDto {
  @ApiProperty()
  @IsNotEmpty()
  note_id: string;

  @ApiProperty()
  @IsNotEmpty()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  share_mode: ShareMode;
}
