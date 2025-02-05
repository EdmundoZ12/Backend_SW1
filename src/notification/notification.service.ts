// src/notification/notification.service.ts
import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { send2NotificationDTO } from './dto/send2notification.dto';
import { FirebaseService } from './firebase.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async sendPush(notification: send2NotificationDTO) {
    try {
      const messaging = this.firebaseService.getMessaging();
      const response = await messaging.send({
        notification: {
          title: notification.title,
          body: notification.body,
        },
        token: notification.deviceId,
        data: {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default',
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              contentAvailable: true,
              sound: 'default',
            },
          },
        },
      });
      return response;
    } catch (error) {
      console.error('Error al enviar notificación push:', error);
      throw error;
    }
  }

  async sendNotification(email: string, apunteUrl: string) {
    try {
      const usuario = await this.usuarioService.getUsuariobyEmail(email);

      if (!usuario) {
        return {
          success: false,
          message: 'Usuario no encontrado',
        };
      }

      if (!usuario.tokenDevice) {
        return {
          success: false,
          message: 'Usuario sin token de dispositivo registrado',
        };
      }

      await this.sendPush({
        title: 'Nuevo Apunte Compartido',
        body: 'Tienes un nuevo apunte para revisar',
        deviceId: usuario.tokenDevice,
      });

      return {
        success: true,
        message: 'Notificación enviada exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al enviar la notificación',
        error: error.message,
      };
    }
  }
}
