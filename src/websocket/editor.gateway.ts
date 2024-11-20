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
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
    // Implementaremos la lógica de desconexión más adelante
  }

  @SubscribeMessage('createSession')
  handleCreateSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { creatorEmail: string },
  ) {
    this.logger.debug(`Creating session for: ${data.creatorEmail}`);

    const sessionId = uuidv4();
    const sessionData: SessionData = {
      sessionId,
      creatorEmail: data.creatorEmail,
      activeUsers: new Set([data.creatorEmail]),
      allowedUsers: new Set([data.creatorEmail]),
      buffer: [],
    };

    this.sessions.set(sessionId, sessionData);
    client.join(sessionId);

    return {
      status: 'success',
      sessionId,
      message: 'Session created successfully',
    };
  }

  @SubscribeMessage('joinSession')
  handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; userEmail: string },
  ) {
    this.logger.debug(
      `Join request - Session: ${data.sessionId}, User: ${data.userEmail}`,
    );

    const session = this.sessions.get(data.sessionId);
    if (!session) {
      return { status: 'error', message: 'Session not found' };
    }

    if (!session.allowedUsers.has(data.userEmail)) {
      return { status: 'error', message: 'User not authorized' };
    }

    client.join(data.sessionId);
    session.activeUsers.add(data.userEmail);

    // Notificar a todos los usuarios de la sesión
    this.server.to(data.sessionId).emit('userJoined', {
      userEmail: data.userEmail,
      activeUsers: Array.from(session.activeUsers),
    });

    return {
      status: 'success',
      activeUsers: Array.from(session.activeUsers),
    };
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
    this.logger.debug(`Adding allowed users to session ${data.sessionId}`);

    const session = this.sessions.get(data.sessionId);
    if (!session) {
      return { status: 'error', message: 'Session not found' };
    }

    if (session.creatorEmail !== data.creatorEmail) {
      return { status: 'error', message: 'Not authorized to add users' };
    }

    data.usersToAdd.forEach((email) => {
      session.allowedUsers.add(email);
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
    },
  ) {
    this.logger.debug(
      `Editor changes from ${data.userEmail} in session ${data.sessionId}`,
    );

    const session = this.sessions.get(data.sessionId);
    if (!session || !session.activeUsers.has(data.userEmail)) {
      return { status: 'error', message: 'Not authorized' };
    }

    // Guardar el delta en el buffer
    session.buffer.push({
      delta: data.delta,
      timestamp: new Date(),
      userEmail: data.userEmail,
    });

    // Emitir cambios a todos menos al emisor
    client.to(data.sessionId).emit('editorChanges', {
      delta: data.delta,
      userEmail: data.userEmail,
    });

    return { status: 'success' };
  }
}
