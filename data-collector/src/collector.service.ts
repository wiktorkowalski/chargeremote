import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { VechicleChargeData } from "./importEntities/vechicleChargeDataImport.entity";
import { VechicleData } from "./importEntities/vechicleDataImport.entity";
import got from "got";
import { Transport, ClientProxy, ClientProxyFactory, } from '@nestjs/microservices';

@Injectable()
export class CollectorService {
  private readonly redisClient: ClientProxy

  constructor(@Inject('VECHICLE_DATA') private readonly vechicleDataRespository: Repository<VechicleData>,
    @Inject('VECHICLE_CHARGE_DATA') private readonly vechicleChargeDataRespository: Repository<VechicleChargeData>,
  ) {
    this.redisClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
      },
    });
  }

  async tryImportData(): Promise<boolean> {
    console.log('start import');
    try {
      const carsData: { cars: VechicleData[] } = await got.get(process.env.DATACOLLECTOR_SOURCE_ADDRESS + 'evs').json();
      const cars = carsData.cars;
      console.log('cars', cars);
      await this.vechicleDataRespository.save(cars);
      const vechicleChargeData = await this.vechicleChargeDataRespository.find();
      const carChargeData: VechicleChargeData[] = [];
      for (const car of cars) {
        console.log(car.vin);
        const chargeDataResponse: { carStatistics: VechicleChargeData[] } = await got.get(process.env.DATACOLLECTOR_SOURCE_ADDRESS + 'evs/' + car.vin).json();
        chargeDataResponse.carStatistics.forEach(chargeData => {
          if (!vechicleChargeData.some((oldData) => {
            const matchVin = oldData.vechicleData.vin === car.vin;
            const matchDate = oldData.datetime.getTime() === new Date(chargeData.datetime).getTime();
            return matchVin && matchDate;
          })) {
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
      console.log(`Length: ${carChargeData.length}`);
      await this.vechicleChargeDataRespository.save(carChargeData);
      this.redisClient.emit('data-import-success', cars.map(car => car.vin));
      console.log('data imported');
      return true;
    }
    catch (ex) {
      console.error(ex);
      return false;
    }
  }
}
