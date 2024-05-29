/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConstantsService } from './constants/constants.service';
import { UtilService } from './util/util.service';

@Module({
  controllers: [AppController],
  providers: [AppService, ConstantsService, UtilService],
})
export class AppModule {}
