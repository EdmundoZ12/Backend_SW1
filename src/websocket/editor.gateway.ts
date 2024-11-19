import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { MemoryService } from './memory.service';
import {
  //DocumentChangeDto,
  DocumentPermission,
  InviteUsersDto,
  JoinSessionDto,
} from './dto/editor.dto';
import { WsJwtGuard } from './guard/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
})
@UseGuards(WsJwtGuard)
export class EditorGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('EditorGateway');
  private userSessions: Map<string, string> = new Map(); // socketId -> sessionId

  constructor(private memoryService: MemoryService) {}

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
    const sessionId = this.userSessions.get(client.id);
    if (sessionId) {
      const userEmail = client.data.email; // Set by WsJwtGuard
      this.handleUserDisconnect(sessionId, userEmail);
    }
  }

  private handleUserDisconnect(sessionId: string, userEmail: string) {
    this.memoryService.removeUserFromSession(sessionId, userEmail);
    this.notifyActiveUsers(sessionId);
  }

  @SubscribeMessage('join-session')
  async handleJoinSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinSessionDto,
  ) {
    const { sessionId, userEmail } = data;
    this.logger.debug(
      `Join session request: ${sessionId} from user: ${userEmail}`,
    );

    if (!this.memoryService.isUserAllowed(sessionId, userEmail)) {
      client.emit('error', { message: 'Not authorized to join this session' });
      return;
    }

    // Agregar usuario a la sesión
    const success = this.memoryService.addUserToSession(
      sessionId,
      userEmail,
      client.id,
    );
    if (!success) {
      client.emit('error', { message: 'Failed to join session' });
      return;
    }

    // Guardar la relación socket -> session
    this.userSessions.set(client.id, sessionId);

    // Unir al cliente a la sala
    client.join(sessionId);

    // Enviar documento actual
    const document = this.memoryService.getDocument(sessionId);
    client.emit('load-document', document);

    // Notificar a todos los usuarios activos
    this.notifyActiveUsers(sessionId);
  }

  @SubscribeMessage('get-document')
  async handleGetDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() sessionId: string,
  ) {
    this.logger.debug(`Get document request for: ${sessionId}`);
    const document = this.memoryService.getDocument(sessionId);
    client.emit('load-document', document || '');
  }

  @SubscribeMessage('send-changes')
  async handleDocumentChange(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any, // todo: cambiar a DocumentChange
  ) {
    const sessionId = this.userSessions.get(client.id);
    if (!sessionId) return;

    this.logger.debug(`Changes received for session ${sessionId}`);

    // Agregar cambio al buffer
    this.memoryService.addToBuffer(sessionId, data);

    // Broadcast a otros usuarios
    client.broadcast.to(sessionId).emit('receive-changes', data);
  }

  @SubscribeMessage('invite-users')
  async handleInviteUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: InviteUsersDto,
  ) {
    const { sessionId, emails, permission } = data;
    const userEmail = client.data.email;

    // Verificar si el usuario tiene permisos para invitar
    const userPermission = this.memoryService.getUserPermission(
      sessionId,
      userEmail,
    );
    if (userPermission !== DocumentPermission.OWNER) {
      client.emit('error', { message: 'Not authorized to invite users' });
      return;
    }

    // Agregar usuarios permitidos
    emails.forEach((email) => {
      this.memoryService.addAllowedUser(sessionId, email, permission);
    });

    // Notificar éxito
    client.emit('users-invited', { success: true });
  }

  private notifyActiveUsers(sessionId: string) {
    const activeUsers = this.memoryService.getActiveUsers(sessionId);
    this.server.to(sessionId).emit('active-users', activeUsers);
  }

  // Autoguardado periódico
  private startAutoSave(sessionId: string) {
    setInterval(() => {
      const changes = this.memoryService.getBufferAndClear(sessionId);
      if (changes.length > 0) {
        // Aquí iría la lógica para guardar en la base de datos
        this.logger.debug(
          `Auto-saving ${changes.length} changes for session ${sessionId}`,
        );
      }
    }, 30000); // Cada 30 segundos
  }
}
