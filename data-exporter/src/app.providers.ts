import { Connection } from 'typeorm';
import { VechicleData } from './entities/vechicleDataImport.entity';
import { VechicleChargeStats } from './entities/vechicleChargeStats.entity';

export const vechicleDataProviders = [
    {
        provide: 'VECHICLE_DATA',
        useFactory: (connection: Connection) => connection.getRepository(VechicleData),
        inject: ['DATABASE_CONNECTION'],
    },
];

export const vechicleChargeStatsProviders = [
    {
        provide: 'VECHICLE_CHARGE_STATS',
        useFactory: (connection: Connection) => connection.getRepository(VechicleChargeStats),
        inject: ['DATABASE_CONNECTION'],
    },
];
