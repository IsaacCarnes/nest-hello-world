/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { spawnSync } from 'child_process';

const consolePrint = true;
const logLevel = 1; //0 is production, 1 is debug

@Injectable()
export class UtilService {


    /*
    Simplifies model by removing workstation from model 
    */
    getModel(originalModel) {
        originalModel = originalModel.toLowerCase();
        if (originalModel.includes("stellant")) return "stellantii";
        if (originalModel.includes("flex")) return "flex";
        if (originalModel.includes("mrxp")) return "mrxp";
        return originalModel;
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

    logDebug(data, isError=false){
        this.logData(data, isError, 1);
    }
}
