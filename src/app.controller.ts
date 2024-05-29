/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConstantsService } from './constants/constants.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly constants: ConstantsService) {}

  @Get()
  qrCode(): string {
    return this.appService.getServerResponse(true, this.constants.AXEDA_MODEL);
  }
}
