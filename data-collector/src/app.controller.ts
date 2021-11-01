import { Controller, Get } from '@nestjs/common';
import { CollectorService } from './collector.service';

@Controller()
export class AppController {
  constructor(
    private readonly collectorService: CollectorService
  ) { }

  @Get()
  async startImport() {
    console.log('Start import');
    return await this.collectorService.startImport();
  }
}
