import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePublicCollaboratorDto {
    @ApiProperty()
    @IsNotEmpty()
    note_id: string;

    @ApiProperty()
    @IsNotEmpty()
    email: string;
}
