/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getServerResponse(status:boolean, message:string): string {
    return `{"jwtStatus":${status ? "success" : "failure"}, "jwtMessage" : "${message}"}`;
  }
}
