import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface SessionData {
  sessionId: string;
  creatorEmail: string;
  activeUsers: Set<string>;
  allowedUsers: Set<string>;
  buffer: any[];
  currentContent: any;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EditorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('EditorGateway');
  private sessions = new Map<string, SessionData>();

  handleConnection(client: Socket) {
    this.logger.debug(`[EditorGateway] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`[EditorGateway] Client disconnected: ${client.id}`);
    // TODO: Implementar limpieza de sesiones y notificación a otros usuarios
  }

  @SubscribeMessage('createSession')
  handleCreateSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { creatorEmail: string; initialContent?: any },
  ) {
    this.logger.debug(
      `[EditorGateway] Creating session for: ${data.creatorEmail}`,
    );

    const sessionId = uuidv4();
    const sessionData: SessionData = {
      sessionId,
      creatorEmail: data.creatorEmail,
      activeUsers: new Set([data.creatorEmail]),
      allowedUsers: new Set([data.creatorEmail]),
      buffer: [],
      currentContent: data.initialContent || { ops: [{ insert: '\n' }] }, // Usar contenido inicial si existe
    };

    this.sessions.set(sessionId, sessionData);
    client.join(sessionId);

    this.logger.debug(`[EditorGateway] Session created with ID: ${sessionId}`);
    this.logger.debug(
      `[EditorGateway] Initial content:`,
      sessionData.currentContent,
    );

    return {
      status: 'success',
      sessionId,
      message: 'Session created successfully',
      currentContent: sessionData.currentContent,
    };
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userEmail: string },
  ) {
    this.logger.debug(
      `[EditorGateway] Join request - Session: ${data.sessionId}, User: ${data.userEmail}`,
    );

    const session = this.sessions.get(data.sessionId);
    if (!session) {
      this.logger.error(`[EditorGateway] Session not found: ${data.sessionId}`);
      return { status: 'error', message: 'Session not found' };
    }

    if (!session.allowedUsers.has(data.userEmail)) {
      this.logger.error(
        `[EditorGateway] User not authorized: ${data.userEmail}`,
      );
      return { status: 'error', message: 'User not authorized' };
    }

    client.join(data.sessionId);
    session.activeUsers.add(data.userEmail);

    this.logger.debug(
      '[EditorGateway] Current session content:',
      session.currentContent,
    );

    this.server.to(data.sessionId).emit('userJoined', {
      userEmail: data.userEmail,
      activeUsers: Array.from(session.activeUsers),
    });

    const responseData = {
      status: 'success',
      activeUsers: Array.from(session.activeUsers),
      currentContent: {
        content: session.currentContent,
        changes: session.buffer,
        version: session.buffer.length,
      },
    };

    this.logger.debug('[EditorGateway] Sending join response:', responseData);
    return responseData;
  }

  @SubscribeMessage('addAllowedUsers')
  handleAddAllowedUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      sessionId: string;
      creatorEmail: string;
      usersToAdd: string[];
    },
  ) {
    this.logger.debug(
      `[EditorGateway] Adding users to session ${data.sessionId}:`,
      data.usersToAdd,
    );

    const session = this.sessions.get(data.sessionId);
    if (!session) {
      this.logger.error(`[EditorGateway] Session not found: ${data.sessionId}`);
      return { status: 'error', message: 'Session not found' };
    }

    if (session.creatorEmail !== data.creatorEmail) {
      this.logger.error(
        `[EditorGateway] Unauthorized add users attempt by: ${data.creatorEmail}`,
      );
      return { status: 'error', message: 'Not authorized to add users' };
    }

    data.usersToAdd.forEach((email) => {
      session.allowedUsers.add(email);
      this.logger.debug(`[EditorGateway] Added user to session: ${email}`);
    });

    return {
      status: 'success',
      message: 'Users added successfully',
      allowedUsers: Array.from(session.allowedUsers),
    };
  }

  @SubscribeMessage('editorChanges')
  handleEditorChanges(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      sessionId: string;
      userEmail: string;
      delta: any;
      content: any;
    },
  ) {
    this.logger.debug(
      `[EditorGateway] Received changes from ${data.userEmail} in session ${data.sessionId}`,
    );
    this.logger.debug('[EditorGateway] Content received:', data.content);

    const session = this.sessions.get(data.sessionId);
    if (!session || !session.allowedUsers.has(data.userEmail)) {
      this.logger.error(`[EditorGateway] Unauthorized change attempt`);
      return { status: 'error', message: 'Not authorized' };
    }

    // Siempre actualizar el contenido actual con el contenido completo recibido
    if (data.content) {
      session.currentContent = data.content;
      this.logger.debug(
        '[EditorGateway] Updated session content:',
        session.currentContent,
      );
    }

    const change = {
      delta: data.delta,
      content: session.currentContent,
      userEmail: data.userEmail,
      timestamp: Date.now(),
    };

    session.buffer.push(change);

    // Emitir a todos los clientes excepto al emisor
    client.to(data.sessionId).emit('editorChanges', change);

    return { status: 'success', version: session.buffer.length };
  }
}
