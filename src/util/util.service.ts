/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { spawnSync } from 'child_process';

const consolePrint = true;
const logLevel = 1; //0 is production, 1 is debug

@Injectable()
export class UtilService {
    getRegData(pathSuffix:string, pathPrefix:string = "HKLM\\SOFTWARE\\MEDRAD\\Certegra"):string{
        try {
            const cmdRes = spawnSync("REG", ["QUERY", pathPrefix, "/v", pathSuffix], { encoding: 'utf8' });
            if (cmdRes.stderr) {
                this.logData(`Could not find registry key at ${pathPrefix}\\${pathSuffix}`, true)
                return '';
            }
            if (cmdRes.stdout) {
                this.logData(`Found registry key at ${pathPrefix}\\${pathSuffix}`)
                const split_arr = cmdRes.stdout.split("    ");
                return `${split_arr[split_arr.length - 1]}`.trim();
            }
        } catch (e) {
            this.logData(`Error while performing registry check at ${pathPrefix}\\${pathSuffix}`, true);
            return '';
        }
    }

    /*
    Used to verify if needed keys are present
    */
    verifyKeys(parsedQuery, keyArr){
        for (let i = 0; i < keyArr.length; i++) {
            if (parsedQuery[keyArr[i]] == undefined) return false;
        }
        return true;
    }

    logData(data, isError=false, levelOfDetail=0):void{
        const LOD_Name = levelOfDetail == 0 ? "" : "{DEBUG} "; //production name does not need to be shown
        if(consolePrint && logLevel >= levelOfDetail) console.log(`${LOD_Name}${isError?"Error: ":""}${data}`)
        //logger.error(`${LOD_Name}${isError?"Error: ":""}${data}`)
    }
}
