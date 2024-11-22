import { IsString, IsArray, IsEmail, IsUUID, IsObject } from 'class-validator';

export class CreateSessionDto {
  @IsEmail()
  creatorEmail: string;
}

export class JoinSessionDto {
  @IsUUID()
  sessionId: string;

  @IsEmail()
  userEmail: string;
}

export class AddAllowedUsersDto {
  @IsUUID()
  sessionId: string;

  @IsEmail()
  creatorEmail: string;

  @IsArray()
  @IsEmail({}, { each: true })
  usersToAdd: string[];
}

export class EditorChangesDto {
  @IsUUID()
  sessionId: string;

  @IsEmail()
  userEmail: string;

  @IsObject()
  delta: any;
}