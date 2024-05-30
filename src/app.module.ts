/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConstantsService } from './constants/constants.service';
import { UtilService } from './util/util.service';
import { PlmQrService } from './plm-qr/plm-qr.service';
import { PlmWiredService } from './plm-wired/plm-wired.service';

@Module({
  controllers: [AppController],
  providers: [AppService, ConstantsService, UtilService, PlmQrService, PlmWiredService],
})
export class AppModule {}
