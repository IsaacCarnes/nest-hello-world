/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PlmService } from './plm.service';

describe('PlmService', () => {
  let service: PlmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlmService],
    }).compile();

    service = module.get<PlmService>(PlmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
