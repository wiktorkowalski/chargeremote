import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetEvInfoQuery } from './getEvInfoQuery';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/evs')
  getEvsInfo() {
    return this.appService.getEvsInfo();
  }

  @Get('/evs/:vin')
  @ApiParam({ name: 'vin', required: true, type: String })
  async getEvInfo(@Param() queryParams: GetEvInfoQuery) {
    const result = await this.appService.getEvInfo(queryParams.vin);
    if (!result) {
      throw new NotFoundException(`VIN ${queryParams.vin} not found`);
    }
    return result;
  }
}
