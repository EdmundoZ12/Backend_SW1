import { PartialType } from '@nestjs/swagger';
import { CreateCrudArchivoDto } from './create-crud_archivo.dto';

export class UpdateCrudArchivoDto extends PartialType(CreateCrudArchivoDto) {}
