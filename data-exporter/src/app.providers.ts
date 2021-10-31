import { Connection } from 'typeorm';
import { VechicleData } from './importEntities/vechicleDataImport.entity';
import { VechicleChargeStats } from './statsEntities/vechicleChargeStats.entity';

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
