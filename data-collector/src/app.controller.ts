import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CollectorService } from './collector.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly collectorService: CollectorService
    ) { }

  @Get()
  startProcessing(){
    console.log('Start processing');
    if(this.collectorService.tryImportData()){
      return {
        status: 'Success',
        message: 'Processing started'
      }
    }

    return {
      status: 'Fail',
      message: 'Could not find vechicle data'
    }
  }
}
