import {
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString, Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ApunteValidator', async: false })
export class ApunteValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const obj = args.object as any;
    // Validar que tenga uno de los dos, pero no ambos
    return (obj.materiaId && !obj.temaId) || (!obj.materiaId && obj.temaId);
  }

  defaultMessage(): string {
    return 'Debe proporcionar "materiaId" o "temaId", pero no ambos al mismo tiempo, y uno de los dos es obligatorio.';
  }
}

export class CreateApunteDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsNumber()
  materiaId?: number;

  @IsOptional()
  @IsNumber()
  temaId?: number;

  @Validate(ApunteValidator) // Aplicamos la lógica personalizada
  validate() {}
}
