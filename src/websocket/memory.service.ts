import { Injectable, Logger } from '@nestjs/common';
import { DocumentPermission } from './dto/editor.dto';

interface SessionUser {
  email: string;
  socketId: string;
  permission: DocumentPermission;
  lastAccess: Date;
  isCreator?: boolean; // Agregamos esta propiedad como opcional
}

interface Session {
  sessionId: string;
  creatorEmail: string;
  activeUsers: Map<string, SessionUser>;
  allowedUsers: Map<string, DocumentPermission>;
  buffer: any[];
  document: any;
  lastModified: Date;
}

@Injectable()
export class MemoryService {
  private sessions: Map<string, Session> = new Map();
  private logger = new Logger('MemoryService');

  createSession(sessionId: string, creatorEmail: string): Session {
    this.logger.debug(
      `Creating new session: ${sessionId} for creator: ${creatorEmail}`,
    );

    const session: Session = {
      sessionId,
      creatorEmail,
      activeUsers: new Map(),
      allowedUsers: new Map([[creatorEmail, DocumentPermission.OWNER]]),
      buffer: [],
      document: '',
      lastModified: new Date(),
    };

    this.sessions.set(sessionId, session);
    this.logger.debug(`Session created successfully:`, session);
    return session;
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  addUserToSession(
    sessionId: string,
    email: string,
    socketId: string,
  ): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) {
      this.logger.warn(`Session ${sessionId} not found`);
      return false;
    }

    const isCreator = email === session.creatorEmail;
    const permission = isCreator
      ? DocumentPermission.OWNER
      : DocumentPermission.EDITOR;

    session.activeUsers.set(email, {
      email,
      socketId,
      permission,
      lastAccess: new Date(),
      isCreator,
    });

    this.logger.debug(
      `User ${email} added to session ${sessionId} with permission ${permission}`,
    );
    return true;
  }

  removeUserFromSession(sessionId: string, email: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.activeUsers.delete(email);
    this.logger.debug(`User ${email} removed from session ${sessionId}`);
  }

  addAllowedUser(
    sessionId: string,
    email: string,
    permission: DocumentPermission,
  ) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.allowedUsers.set(email, permission);
    this.logger.debug(
      `User ${email} allowed in session ${sessionId} with permission ${permission}`,
    );
    return true;
  }

  isUserAllowed(sessionId: string, email: string): boolean {
    const session = this.sessions.get(sessionId);
    return session ? session.allowedUsers.has(email) : false;
  }

  getActiveUsers(sessionId: string): any[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    return Array.from(session.activeUsers.values()).map((user) => ({
      ...user,
      isCreator: user.email === session.creatorEmail,
    }));
  }

  getUserPermission(
    sessionId: string,
    email: string,
  ): DocumentPermission | undefined {
    const session = this.sessions.get(sessionId);
    return session?.allowedUsers.get(email);
  }

  addToBuffer(sessionId: string, change: any) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.buffer.push(change);
    session.lastModified = new Date();
  }

  getBufferAndClear(sessionId: string): any[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    const buffer = [...session.buffer];
    session.buffer = [];
    return buffer;
  }

  updateDocument(sessionId: string, document: any) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.document = document;
    session.lastModified = new Date();
  }

  getDocument(sessionId: string): any {
    return this.sessions.get(sessionId)?.document;
  }
}
