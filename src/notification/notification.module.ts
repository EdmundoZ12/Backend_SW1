import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [UsuarioModule],
  controllers: [NotificationController],
  providers: [NotificationService, FirebaseService],
  exports: [NotificationService],
})
export class NotificationModule {}
