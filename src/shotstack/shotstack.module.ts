import { Module } from '@nestjs/common';
import { ShotstackService } from './shotstack.service';
import { ShotstackController } from './shotstack.controller';
import { ConfigModule } from '@nestjs/config';
import shotstackConfig from './config/shotstack.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';

@Module({
  imports: [
    ConfigModule.forFeature(shotstackConfig),
    TypeOrmModule.forFeature([Video])
  ],
  controllers: [ShotstackController],
  providers: [ShotstackService],
})
export class ShotstackModule {}
