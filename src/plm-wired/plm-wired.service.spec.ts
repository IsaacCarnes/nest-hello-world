/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PlmWiredService } from './plm-wired.service';

describe('PlmWiredService', () => {
  let service: PlmWiredService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlmWiredService],
    }).compile();

    service = module.get<PlmWiredService>(PlmWiredService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
