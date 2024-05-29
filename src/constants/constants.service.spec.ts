/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ConstantsService } from './constants.service';
import { UtilService } from '../util/util.service';


describe('ConstantsService', () => {
  let service: ConstantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UtilService],
      providers: [ConstantsService, UtilService],
      exports: [ConstantsService],
    }).compile();

    service = module.get<ConstantsService>(ConstantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
