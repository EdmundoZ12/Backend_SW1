import { PartialType } from '@nestjs/swagger';
import { CreateApunteCompartidoDto } from './create-apuntecompartido.dto';

export class UpdateApuntescompartidoDto extends PartialType(
  CreateApunteCompartidoDto,
) {}
