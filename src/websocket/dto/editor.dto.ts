import { IsString, IsEmail, IsArray, IsEnum, IsOptional } from 'class-validator';

export enum DocumentPermission {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export class JoinSessionDto {
  @IsString()
  sessionId: string;

  @IsEmail()
  userEmail: string;
}

export class DocumentChangeDto {
  ops: any[];
  userEmail: string;
  timestamp: number;
}

export class InviteUsersDto {
  @IsString()
  sessionId: string;

  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];

  @IsEnum(DocumentPermission)
  @IsOptional()
  permission: DocumentPermission = DocumentPermission.EDITOR;
}