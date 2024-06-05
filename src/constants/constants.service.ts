/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UtilService } from 'src/util/util.service';

let utilServiceCopy = null;
let configData = null;

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
    PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpgIBAAKCAQEA6OOvYVVd4vq4Q2K1SPOZ9IBe36QDAqrMK5e0DkmJlhy9Y29E\nWfRlhEzt5+2IJU+SuKQojoNY3U2p4BA7KYbvH2DwCuxtTUXjP44fych3qtfMmnoM\nwPzmgK1afYcTs/cM4JtYtdpEGSTst1mRH+Als8W2qc9MH2SFeQe3H/SmSF8KBrfO\nzDtAHCRG0+vPTJcCFdmsyQfSLigwFsUULWkxNdtGp7i7z/cMdJ1fq/dHDaB34EEz\n4ye7B/XeQlj0jlO5cOUco22Kne29Wp3vXQUbKHRGD8mXMBGBoBVOFxx8aKoXqoIm\nQkLwOM55uhreOaEJDfjHnThonxyJguMmY2KfkwIDAQABAoIBAQDhQol6nfWn/FaK\nZ0lt/KHnStt5ecynocjGSYARabO5DKdrLE5yq+AdbcOX17seS69hBPdtkUI9HEe5\nwDlZW3ijY0ILbs/yNC0wZin9JPgKuZzftjnr2TKjOAoU7Lh0E/vSrK/LhgjkQUDt\nv6aNrGMLVavu5+F7Y+FuRbYtJJhJ2jq4UmUIgxinvBaH7QdAxPLFgupaVFjOtVQ6\najjZyjByHYg4ouBLIHez1PfeDPTLZkeUl/ULBIow96HsbJkqzgeTl9uV+1bNy4xO\ndJJHuF61IZiEbh4plB4E2u0m8mblS32A+PbVCCzg4x29H90W5uc7YvANRveJ7Rkv\naVhIYcixAoGBAP6DIYEdPM26pSgVYkfPMLDdc4yq01X5GSJVmW1MozfI6qmm8kHp\n+ibajMzwhXGARR6OZMxORDp3JheqzBxRwYBzS95z8t9Dh7vCFRbxEzcV8d3dVFu0\nYGUFANXcgykYvVjG0jPXwJS6PlDoAJLYvVsSRzPMYUosWzmY3LEtIOTtAoGBAOpA\nMkO4kp1GO9Z2mvqWchI1vBsCIGjHIWivsKqmYXBsKiLeyn6n3V57EhW0V3euFqiE\n5rp85tdYxjNv7CFojbjiExRW2cnvoq4cs+it8HWlUtGgOLmrzih/zukfFRsY/d2a\ns6eyJeJmY4PzzS7AJCpskZ55/hIo2SBvgurWkYZ/AoGBAP1g1REyZ181asjuCQsO\nhR3/SdMIGh+kP1aEO5upyXB3EM/XSaU/Z/AYckZxSZiGp8lU35rabGh8SCsVueCT\nr/3OSwDrFCcbltzgypgtZwDXUxSbDSnC+Jh5k6xVvSpD2/Wu8oP0TmCCzhlD75ZC\nOrmZB9PUrCLo5+T+fu/Qyse9AoGBAMLqT+jRuA1t13SIlERW0uwcEj1W86i7qSz2\no8YbU5C8MAN75nqlKynmthGhUfafwPLQQzyBmYMutx0t0AmseeCRHNcbvXSuFWtT\nLtA5i5AY1GThMNIuBwjj8ENCPcmibfrrMvoi3isYj03Im75+2pkCZdi8IZDytFis\n8P5/M+/5AoGBAIZzfPB2dmZX4OWvcgrfubzT6uhegSNO44zwj2UTgxyshcLkPiy+\np7FesUDph/imXkWVnhYRc3J00OZ1GsnAq+FGFl7Fyg3LaE7jrZFOQaTZhnARtriq\nuTnLM/5EsMQje5VKa0/AYBkL7Jee2U8p/tBbuns4tzVMcANiFVfW7rCP\n-----END RSA PRIVATE KEY-----";
    PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6OOvYVVd4vq4Q2K1SPOZ\n9IBe36QDAqrMK5e0DkmJlhy9Y29EWfRlhEzt5+2IJU+SuKQojoNY3U2p4BA7KYbv\nH2DwCuxtTUXjP44fych3qtfMmnoMwPzmgK1afYcTs/cM4JtYtdpEGSTst1mRH+Al\ns8W2qc9MH2SFeQe3H/SmSF8KBrfOzDtAHCRG0+vPTJcCFdmsyQfSLigwFsUULWkx\nNdtGp7i7z/cMdJ1fq/dHDaB34EEz4ye7B/XeQlj0jlO5cOUco22Kne29Wp3vXQUb\nKHRGD8mXMBGBoBVOFxx8aKoXqoImQkLwOM55uhreOaEJDfjHnThonxyJguMmY2Kf\nkwIDAQAB\n-----END PUBLIC KEY-----";
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