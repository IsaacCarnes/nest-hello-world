/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { writeFileSync } from 'fs';
import { createCipheriv } from 'crypto';
import * as QRCode from 'qrcode';

import { UtilService } from 'src/util/util.service';

@Injectable()
export class PlmQrService {
    constructor(private readonly utilService: UtilService) {}
    /* QR Code Functions */
    /*
        Accepts qr code data and filepath to save qr code as parameters.
        Encrypts dataString and creates writes qrCode png to filePath
    */
    createQRCode(dataString, filePath = path.join(__dirname, 'qrCode.png')) {
        const Key = "12345678901234567890123456789012";
        const IV = "RF22SW76BV83EDH8";
        const encryptionType = 'aes-256-cbc';
        const encryptionEncoding = 'base64';
        const bufferEncryption = 'utf-8';

        if (dataString == undefined || dataString.length <= 0) throw new Error('Data error');
        if (Key == undefined || Key.length != 32) throw new Error('Data error');
        if (IV == undefined || IV.length != 16) throw new Error('Data error');

        const key = Buffer.from(Key, bufferEncryption);
        const iv = Buffer.from(IV, bufferEncryption);
        const cipher = createCipheriv(encryptionType, key, iv);
        let encrypted = cipher.update(dataString, bufferEncryption, encryptionEncoding);
        encrypted += cipher.final(encryptionEncoding);
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(encrypted)
                .then(url => {
                    const data = url.replace(/^data:image\/\w+;base64,/, "");
                    const buf = Buffer.from(data, 'base64');
                    writeFileSync(filePath, buf); //, (err:any) => { if (err) { logDebug(`Could not write qr file, ${err}`, true) } else { logDebug(`QR Code png has been saved`)}}
                    resolve("true");
                })
                .catch(err => {
                    this.utilService.logData(`Could not create qr code, ${err}`, true)
                    reject("false");
                })
        })
    }

    /*
        Accepts injector data as parameters including model, serial and asset.
        Formats data and adds randomized id string to end
    */
    createQRData(model, serial, asset) {
        const string1 = this.makeRandString(6);
        const string2 = this.makeRandString(6);
        const string3 = this.makeRandString(6);
        let string4 = this.makeRandString(2);
        while (this.getLastTwoDigits(string1) == string4 || this.getLastTwoDigits(string2) == string4 || this.getLastTwoDigits(string3) == string4) {
            string4 = this.makeRandString(2);
        }
        const simplifiedModel = this.utilService.getModel(model);
        const outKey = `${simplifiedModel};${serial};${asset};${string1}${string2}${string3}${string4}`
        return outKey;
    }

    makeRandString(length) {
        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        const charactersLength = characters.length;
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters[Math.floor(Math.random() * charactersLength)];
        }
        return result;
    }

    getLastTwoDigits(str) {
        return str.substring(str.length - 2, str.length);
    }
}
