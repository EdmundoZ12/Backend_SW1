import { Test, TestingModule } from '@nestjs/testing';
import { CrudArchivoController } from './crud_archivo.controller';
import { CrudArchivoService } from './crud_archivo.service';

describe('CrudArchivoController', () => {
  let controller: CrudArchivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrudArchivoController],
      providers: [CrudArchivoService],
    }).compile();

    controller = module.get<CrudArchivoController>(CrudArchivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
