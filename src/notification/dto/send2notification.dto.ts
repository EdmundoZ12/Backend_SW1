import { ApiProperty } from '@nestjs/swagger';
export class send2NotificationDTO {
  @ApiProperty()
  title: string;
  @ApiProperty()
  body: string;
  @ApiProperty()
  deviceId: string;
}