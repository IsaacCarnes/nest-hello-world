/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { UtilService } from 'src/util/util.service';
let utilServiceCopy = null;
let configData = null
@Injectable()
export class ConstantsService {
    constructor(private readonly utilService: UtilService) {
        utilServiceCopy = utilService
        configData = getConfigData();
    }
    AXEDA_MODEL = this.utilService.getRegData("AxedaModel");
    WCRU_SERIAL_NUMBER= this.utilService.getRegData("SerialNumber");
    WCRU_ASSET_NUMBER= '';
    WCRU_VERSION= this.utilService.getRegData("Version");
    COUNTRY_CODE= this.utilService.getRegData("InstalledCountry");
    STATUS_FILE_NAME= "InjVersionStatus.json";
    CONTROLLER_FILE_NAME= "bundle_data.txt";
    AXEDA_REMOTE_FOLDER= path.join("C:", "Axeda", "Gateway", "SM");
    //00240005 - reboot required, 00240006 - already installed, https://learn.microsoft.com/en-us/windows/win32/wua_sdk/wua-success-and-error-codes-?redirectedfrom:MSDN
    SUCCESS_CODES= ["00240005", "00240006"];
    getPort = () => {return (configData != undefined && configData['appPort'] != undefined) ? configData['appPort'] : "6001"};
    getIPhonePort = () => {return (configData != undefined && configData['iphonePort'] != undefined) ? configData['iphonePort'] : "6002"};
    getSoftwareFilePath = () => {return (configData != undefined && configData['bundlePath'] != undefined) ? configData['bundlePath'] : path.join(__dirname, 'bundles')};
}

function getConfigData():void {
    const configPath = path.join(__dirname, 'appConfig.json');
    const configFile = fs.existsSync(configPath) ? fs.readFileSync(path.join(__dirname, 'appConfig.json'), { encoding: 'utf8', flag: 'r' }) : null;
    if (configFile) {
        const jsonData = JSON.parse(configFile);
        utilServiceCopy.logData("App config file found.");
        return jsonData;
    } else {
        utilServiceCopy.logData("App config file could not be found.", true)
        return undefined;
    }
}