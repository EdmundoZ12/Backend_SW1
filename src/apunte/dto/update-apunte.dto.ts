import { PartialType } from '@nestjs/mapped-types';
import { CreateApunteDto } from './create-apunte.dto';

export class UpdateApunteDto extends PartialType(CreateApunteDto) {}
