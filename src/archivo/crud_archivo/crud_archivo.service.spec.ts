import { Test, TestingModule } from '@nestjs/testing';
import { CrudArchivoService } from './crud_archivo.service';

describe('CrudArchivoService', () => {
  let service: CrudArchivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrudArchivoService],
    }).compile();

    service = module.get<CrudArchivoService>(CrudArchivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
