import { Connection } from 'typeorm';
import { VechicleChargeData } from './entities/vechicleChargeDataImport.entity';
import { VechicleData } from './entities/vechicleDataImport.entity';

export const vechicleDataProviders = [
  {
    provide: 'VECHICLE_DATA',
    useFactory: (connection: Connection) => connection.getRepository(VechicleData),
    inject: ['DATABASE_CONNECTION'],
  },
];

export const vechicleChargeDataProviders = [
  {
    provide: 'VECHICLE_CHARGE_DATA',
    useFactory: (connection: Connection) => connection.getRepository(VechicleChargeData),
    inject: ['DATABASE_CONNECTION'],
  },
];
