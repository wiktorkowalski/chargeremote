import { Connection } from 'typeorm';
import { VechicleChargeData } from './entities/vechicleChargeDataImport.entity';
import { VechicleData } from './entities/vechicleDataImport.entity';
import { VechicleChargeStats } from './entities/vechicleChargeStats.entity';

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

export const vechicleChargeStatsProviders = [
    {
        provide: 'VECHICLE_CHARGE_STATS',
        useFactory: (connection: Connection) => connection.getRepository(VechicleChargeStats),
        inject: ['DATABASE_CONNECTION'],
    },
];
