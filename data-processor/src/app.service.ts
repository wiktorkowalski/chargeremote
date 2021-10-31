import { Inject, Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisClientType } from 'redis/dist/lib/client';
import { Repository } from 'typeorm';
import { VechicleChargeData } from './importEntities/vechicleChargeDataImport.entity';
import { VechicleChargeStats } from './statsEntities/vechicleChargeStats.entity';

@Injectable()
export class AppService {
  private readonly redisClient: RedisClientType;

  constructor(@Inject('VECHICLE_CHARGE_DATA') private readonly vechicleChargeDataRespository: Repository<VechicleChargeData>,
    @Inject('VECHICLE_CHARGE_STATS') private readonly vechicleChargeStatsRespository: Repository<VechicleChargeStats>) {
    this.redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    this.setupRedisClient();
  }

  async setupRedisClient() {
    this.redisClient.on('error', (err) => {
      console.error(err);
    });
    await this.redisClient.connect();
    await this.redisClient.subscribe('data-import-success', (message) => {
      console.log('Received data-import-success');
      this.processData(JSON.parse(message).data);
    });
  }

  async processData(vins: string[]) {
    console.log(`Start processing {${vins}}`);
    const vechicleChargeData = await (await this.vechicleChargeDataRespository.find({ loadEagerRelations: true })).filter((item) => { return vins.includes(item.vechicleData.vin); }); //filtering should be done on DB side
    console.log(`Found ${vechicleChargeData.length} records`);
    const vechicleChargeDataMap = new Map<string, VechicleChargeStats>();
    const vechicleChargePowerMap = new Map<string, number[]>();
    for (const data of vechicleChargeData) {
      if (!vechicleChargeDataMap.has(data.vechicleData.vin)) { vechicleChargeDataMap.set(data.vechicleData.vin, { vechicleData: data.vechicleData, soc: data.soc, datetime: data.datetime, status: data.status, averageChargingPower: 0 }); }
      if (!vechicleChargePowerMap.has(data.vechicleData.vin)) { vechicleChargePowerMap.set(data.vechicleData.vin, []); }

      if (vechicleChargeDataMap.get(data.vechicleData.vin).datetime.getTime() < data.datetime.getTime()) {
        vechicleChargeDataMap.set(data.vechicleData.vin, { vechicleData: data.vechicleData, soc: data.soc, datetime: data.datetime, status: data.status, averageChargingPower: 0 });
      }
      vechicleChargePowerMap.get(data.vechicleData.vin).push(data.chargingPower);
    }
    for (const vin of vins) {
      const temp = vechicleChargePowerMap.get(vin).reduce((a, b) => a + b, 0) / vechicleChargePowerMap.get(vin).length;
      vechicleChargeDataMap.get(vin).averageChargingPower = temp;
    }
    console.log(`Finished processing {${vins}}`);

    this.vechicleChargeStatsRespository.save(Array.from(vechicleChargeDataMap.values()));
  }
}
