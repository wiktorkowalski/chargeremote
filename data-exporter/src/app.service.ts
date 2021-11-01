import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { VechicleChargeStats } from './entities/vechicleChargeStats.entity';
import { VechicleInfo } from './vechicleInfo';

@Injectable()
export class AppService {
  constructor(@Inject('VECHICLE_CHARGE_STATS') private readonly vechicleChargeStatsRespository: Repository<VechicleChargeStats>
  ) { }

  async getEvsInfo(): Promise<VechicleInfo[]> {
    const vechicleChargeStats = await this.vechicleChargeStatsRespository.find();
    const vechicleData: VechicleInfo[] = [];
    for (const stats of vechicleChargeStats) {
      vechicleData.push({
        vin: stats.vechicleData.vin,
        made: stats.vechicleData.made,
        model: stats.vechicleData.model,
        year: stats.vechicleData.year,
        details: {
          currentSoC: stats.soc,
          currentStatus: stats.status,
          averageChargingPower: stats.averageChargingPower,
          datetime: stats.datetime,
        }
      });
    }
    return vechicleData;
  }

  async getEvInfo(vin: string): Promise<VechicleInfo> {
    const vechicleChargeStats = await this.vechicleChargeStatsRespository.findOne({ where: { vin: vin } });
    return {
      vin: vechicleChargeStats.vechicleData.vin,
      made: vechicleChargeStats.vechicleData.made,
      model: vechicleChargeStats.vechicleData.model,
      year: vechicleChargeStats.vechicleData.year,
      details: {
        currentSoC: vechicleChargeStats.soc,
        currentStatus: vechicleChargeStats.status,
        averageChargingPower: vechicleChargeStats.averageChargingPower,
        datetime: vechicleChargeStats.datetime,
      }
    }
  }
}
