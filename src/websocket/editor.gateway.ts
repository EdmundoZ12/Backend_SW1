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

interface UserPermissions {
  canEdit: boolean;
  canInvite: boolean;
  canChangePermissions: boolean;
}

interface SessionData {
  sessionId: string;
  creatorEmail: string;
  activeUsers: Set<string>;
  allowedUsers: Set<string>;
  userPermissions: Map<string, UserPermissions>;
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

    // Buscar el usuario en todas las sesiones activas
    this.sessions.forEach((session, sessionId) => {
      const userEmail = client.handshake.query.userEmail as string;
      if (session.activeUsers.has(userEmail)) {
        session.activeUsers.delete(userEmail);

        // Notificar a otros usuarios
        this.server.to(sessionId).emit('collaborationUpdate', {
          type: 'USER_LEFT',
          sessionId,
          data: {
            userEmail,
            activeUsers: Array.from(session.activeUsers),
          },
          timestamp: Date.now(),
        });
      }
    });
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

    const creatorPermissions: UserPermissions = {
      canEdit: true,
      canInvite: true,
      canChangePermissions: true,
    };

    const sessionData: SessionData = {
      sessionId,
      creatorEmail: data.creatorEmail,
      activeUsers: new Set([data.creatorEmail]),
      allowedUsers: new Set([data.creatorEmail]),
      userPermissions: new Map([[data.creatorEmail, creatorPermissions]]),
      buffer: [],
      currentContent: data.initialContent || { ops: [{ insert: '\n' }] },
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

    // Obtener los permisos del usuario que se une
    const permissions = session.userPermissions.get(data.userEmail) || {
      canEdit: true,
      canInvite: false,
      canChangePermissions: false,
    };

    this.logger.debug(
      '[EditorGateway] Current session content:',
      session.currentContent,
    );

    // Emitir el evento con la información correcta
    this.server.to(data.sessionId).emit('collaborationUpdate', {
      type: 'USER_JOINED',
      sessionId: data.sessionId,
      data: {
        userEmail: data.userEmail,
        permissions,
        activeUsers: Array.from(session.activeUsers),
      },
      timestamp: Date.now(),
    });

    return {
      status: 'success',
      activeUsers: Array.from(session.activeUsers),
      currentContent: {
        content: session.currentContent,
        changes: session.buffer,
        version: session.buffer.length,
      },
      permissions: Object.fromEntries(session.userPermissions),
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
      // Asignar permisos por defecto a los nuevos usuarios
      if (!session.userPermissions.has(email)) {
        session.userPermissions.set(email, {
          canEdit: true,
          canInvite: false,
          canChangePermissions: false,
        });
      }
      this.logger.debug(`[EditorGateway] Added user to session: ${email}`);
    });

    return {
      status: 'success',
      message: 'Users added successfully',
      allowedUsers: Array.from(session.allowedUsers),
    };
  }

  @SubscribeMessage('updatePermissions')
  handleUpdatePermissions(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      sessionId: string;
      targetUserEmail: string;
      newPermissions: UserPermissions;
      requestedByEmail: string;
    },
  ) {
    this.logger.debug(
      `[EditorGateway] Updating permissions for user: ${data.targetUserEmail}`,
    );

    const session = this.sessions.get(data.sessionId);
    if (!session) {
      this.logger.error(`[EditorGateway] Session not found: ${data.sessionId}`);
      return { status: 'error', message: 'Session not found' };
    }

    const requesterPermissions = session.userPermissions.get(
      data.requestedByEmail,
    );
    if (!requesterPermissions?.canChangePermissions) {
      this.logger.error(
        `[EditorGateway] User not authorized to change permissions: ${data.requestedByEmail}`,
      );
      return {
        status: 'error',
        message: 'Not authorized to change permissions',
      };
    }

    session.userPermissions.set(data.targetUserEmail, data.newPermissions);

    this.server.to(data.sessionId).emit('collaborationUpdate', {
      type: 'PERMISSIONS_CHANGED',
      sessionId: data.sessionId,
      data: {
        userEmail: data.targetUserEmail,
        permissions: data.newPermissions,
      },
      timestamp: Date.now(),
    });

    return {
      status: 'success',
      message: 'Permissions updated successfully',
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

    // Verificar permiso de edición
    const userPermissions = session.userPermissions.get(data.userEmail);
    if (!userPermissions?.canEdit) {
      this.logger.error(`[EditorGateway] User does not have edit permission`);
      return { status: 'error', message: 'No edit permission' };
    }

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

    client.to(data.sessionId).emit('editorChanges', change);

    return { status: 'success', version: session.buffer.length };
  }
}
