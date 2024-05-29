/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PlmQrService } from './plm-qr.service';

describe('PlmService', () => {
  let service: PlmQrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlmQrService],
    }).compile();

    service = module.get<PlmQrService>(PlmQrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
