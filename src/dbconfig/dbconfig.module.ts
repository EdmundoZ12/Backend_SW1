import { Module } from '@nestjs/common';
import { DbconfigService } from './dbconfig.service';

@Module({
  providers: [DbconfigService],
  exports: [DbconfigService],
})
export class DbconfigModule {}
