import { Injectable } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-admin.json'; // asegúrate que la ruta sea correcta

@Injectable()
export class NotificationService {
  constructor(private readonly usuarioService: UsuarioService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          privateKey: serviceAccount.private_key,
          clientEmail: serviceAccount.client_email,
        } as admin.ServiceAccount),
      });
    }
  }

  async sendNotification(email: string, apunteUrl: string) {
    try {
      const usuario = await this.usuarioService.getUsuariobyEmail(email);

      if (!usuario || !usuario.tokenDevice) {
        return {
          success: false,
          message:
            'Usuario no encontrado o sin token de dispositivo registrado',
        };
      }

      const message = {
        notification: {
          title: 'Nuevo Apunte Compartido',
          body: `Tienes un nuevo apunte para revisar`,
        },
        data: {
          url: apunteUrl,
        },
        token: usuario.tokenDevice,
      };

      const response = await admin.messaging().send(message);

      return {
        success: true,
        message: 'Notificación enviada exitosamente',
        messageId: response,
      };
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      return {
        success: false,
        message: 'Error al enviar la notificación',
        error: error.message,
      };
    }
  }
}
