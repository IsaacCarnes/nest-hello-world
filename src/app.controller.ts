/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PlmService } from './plm/plm.service';
import { ConstantsService } from './constants/constants.service';
import { UtilService } from './util/util.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly plmService: PlmService, private readonly constants: ConstantsService, private readonly utilService: UtilService) {}

  @Get()
  baseRoute(): string {
    return "base route"
  }
  @Get("/qrData")
  qrData(): string {
    return this.appService.getServerResponse(true, this.plmService.createQRData(this.constants.AXEDA_MODEL, this.constants.WCRU_SERIAL_NUMBER, this.constants.WCRU_ASSET_NUMBER));
  }
  @Get("/qrCode")
  qrCode(@Query() params: any ): string {
    if (params.length < 1 || !this.utilService.verifyKeys(params, ['data'])) {
      this.utilService.logData("/qrCode request rejected, needs 'data' as parameter", true);
      return this.appService.getServerResponse(false, "Request rejected, needs 'data' as parameter");
    }
    return params;
  }
}
