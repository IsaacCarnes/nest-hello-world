/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PlmWiredService } from './plm-wired/plm-wired.service';
import { PlmQrService } from './plm-qr/plm-qr.service';
import { ConstantsService } from './constants/constants.service';
import { UtilService } from './util/util.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly plmQrService: PlmQrService, private readonly plmWiredService: PlmWiredService, private readonly constants: ConstantsService, private readonly utilService: UtilService) { }

  @Get()
  baseRoute(): string {
    return "base route";
  }
  @Get("/qrData")
  qrData(): string {
    return this.appService.getServerResponse(true, this.plmQrService.createQRData(this.constants.AXEDA_MODEL, this.constants.WCRU_SERIAL_NUMBER, this.constants.WCRU_ASSET_NUMBER));
  }
  @Get("/qrCode")
  async qrCode(@Query() params: any) {
    if (params.length < 2 || !this.utilService.verifyKeys(params, ['data', 'path'])) {
      this.utilService.logData("/qrCode request rejected, needs 'data' and 'path' as parameters", true);
      return this.appService.getServerResponse(false, "Request rejected, needs 'data' and 'path' as parameters");
    }
    let response = ""
    await this.plmQrService.createQRCode(params.data, params.path).then(() => {
      this.utilService.logDebug(`QR Code has been saved to ${params.path}`)
      response = this.appService.getServerResponse(true, "QR code has been saved.");
    }).catch((err) => {
      this.utilService.logData(`Could not encrypt qr data - ${err}`, true)
      response = this.appService.getServerResponse(false, "Could not encrypt qr data")
    })
    return response;
  }
  @Get("/wiredHandshake")
  async wiredHandshake() {
    if (this.plmWiredService.isWiredHandshaking()) {
      this.plmWiredService.stopWiredHandshake();
      return this.appService.getServerResponse(true, "Stopped wired handshake");
    }
    let response = ""
    await this.plmWiredService.startWiredHandshake(this.constants.AXEDA_MODEL, this.constants.WCRU_SERIAL_NUMBER, this.constants.WCRU_ASSET_NUMBER).then((data) => {
      response = data;
    }).catch((err) => {
      this.utilService.logData(`Could not start wired handshake - ${err}`, true);
      response = this.appService.getServerResponse(false, "Could not start wired handshake.")
    });
    return response;
  }

}
