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
  async qrCode(@Query() params: any) {
    if (params.length < 2 || !this.utilService.verifyKeys(params, ['data', 'path'])) {
      this.utilService.logData("/qrCode request rejected, needs 'data' and 'path' as parameters", true);
      return this.appService.getServerResponse(false, "Request rejected, needs 'data' and 'path' as parameters");
    }
    let response = ""
    await this.plmService.createQRCode(params.data, params.path).then(() => {
      this.utilService.logDebug(`QR Code has been saved to ${params.path}`)
      response = this.appService.getServerResponse(true, "QR code has been saved.");
    }).catch((err) => {
      this.utilService.logData(`Could not encrypt qr data - ${err}`, true)
      response = this.appService.getServerResponse(false, "Could not encrypt qr data")
    })
    return response;
  }
}
