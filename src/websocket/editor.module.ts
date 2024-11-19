import { Module } from '@nestjs/common';
import { EditorGateway } from './editor.gateway';
import { MemoryService } from './memory.service';

@Module({
  providers: [EditorGateway, MemoryService],
})
export class EditorModule {}
