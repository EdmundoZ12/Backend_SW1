import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() sendNotificationDto: SendNotificationDto) {
    try {
      const result = await this.notificationService.sendNotification(
        sendNotificationDto.email,
        sendNotificationDto.apunteUrl,
      );

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        'Error al procesar la notificación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
