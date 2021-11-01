import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { createClient } from 'redis';
import { RedisClientType } from "redis/dist/lib/client";
import { VechicleChargeData } from "./entities/vechicleChargeDataImport.entity";
import { VechicleData } from "./entities/vechicleDataImport.entity";
import got from "got";
import { ImportResponse } from "./importResponse";

@Injectable()
export class CollectorService {
  private readonly redisClient: RedisClientType;

  constructor(@Inject('VECHICLE_DATA') private readonly vechicleDataRespository: Repository<VechicleData>,
    @Inject('VECHICLE_CHARGE_DATA') private readonly vechicleChargeDataRespository: Repository<VechicleChargeData>,
  ) {
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
  }

  async startImport(): Promise<ImportResponse> {
    try {
      const carsData: { cars: VechicleData[] } = await got.get(process.env.DATACOLLECTOR_SOURCE_ADDRESS + 'evs').json();
      const cars = carsData.cars;
      await this.vechicleDataRespository.save(cars);
      const carChargeData = await this.getVechicleChargeData(cars);
      console.log(`Length: ${carChargeData.length}`);
      await this.vechicleChargeDataRespository.save(carChargeData);
      this.redisClient.publish('data-import-success', JSON.stringify(cars.map(car => car.vin)));
      console.log('data imported');
      return { isSuccess: true };
    }
    catch (ex) {
      console.error(ex);
      return { isSuccess: false, message: ex.message };
    }
  }

  async getVechicleChargeData(vechicleData: VechicleData[]): Promise<VechicleChargeData[]> {
    const carChargeData: VechicleChargeData[] = [];
    const vechicleChargeData = await this.vechicleChargeDataRespository.find();
    for (const car of vechicleData) {
      console.log(car.vin);
      const chargeDataResponse: { carStatistics: VechicleChargeData[] } = await got.get(process.env.DATACOLLECTOR_SOURCE_ADDRESS + 'evs/' + car.vin).json();
      chargeDataResponse.carStatistics.forEach(chargeData => {
        if (!vechicleChargeData.some((oldData) => this.isDuplicateEvent(oldData, chargeData, car.vin))) {
          carChargeData.push({
            vechicleData: car,
            datetime: chargeData.datetime,
            soc: chargeData.soc,
            chargingPower: chargeData.chargingPower,
            status: chargeData.status
          });
        }
      });
    }
    return carChargeData;
  }

  isDuplicateEvent(oldData: VechicleChargeData, chargeData: VechicleChargeData, vin: string): boolean {
    const matchVin = oldData.vechicleData.vin === vin;
    const matchDate = oldData.datetime.getTime() === new Date(chargeData.datetime).getTime();
    return matchVin && matchDate;
  }
}
