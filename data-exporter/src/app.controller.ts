import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/evs')
  getEvsInfo() {
    return this.appService.getEvsInfo();
  }

  @Get('/evs/:vin')
  getEvInfo(vin: string) {
    return this.appService.getEvInfo(vin);
  }
}
