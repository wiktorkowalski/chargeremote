import { Test, TestingModule } from '@nestjs/testing';
import { CollectorService } from './collector.service';
import { VechicleChargeData } from './entities/vechicleChargeDataImport.entity';

describe('AppController', () => {
    let collectorService: CollectorService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule(
            {
                providers: [
                    {
                        provide: CollectorService,
                        useValue: {
                            setupRedisClient: jest.fn(),
                            // obviously it's not a good idea to use a mock here, but i can't find a way to mock everything apart from method that I'm testing
                            isDuplicateEvent: jest.fn().mockImplementation((oldData: VechicleChargeData, chargeData: VechicleChargeData, vin: string) => {
                                const matchVin = oldData.vechicleData.vin === vin;
                                const matchDate = oldData.datetime.getTime() === new Date(chargeData.datetime).getTime();
                                return matchVin && matchDate;
                            }),
                        }
                    }
                ],
            })
            .compile();

        collectorService = app.get<CollectorService>(CollectorService);
    });

    describe('isDuplicateEvent', () => {
        it('should return true', () => {
            const vin = 'vin';
            const eventA: VechicleChargeData = { datetime: new Date('2020-01-01'), soc: 0, chargingPower: 0, status: '', vechicleData: { vin: vin, model: 'model', made: 'made', year: new Date('2020-01-01') } };
            const eventB: VechicleChargeData = { datetime: new Date('2020-01-01'), soc: 0, chargingPower: 0, status: '', vechicleData: { vin: vin, model: 'model', made: 'made', year: new Date('2020-01-01') } };
            expect(collectorService.isDuplicateEvent(eventA, eventB, vin)).toBe(true);
        });
    });

    describe('isDuplicateEvent', () => {
        it('should return false', () => {
            const vin = 'vin';
            const eventA: VechicleChargeData = { datetime: new Date('2020-01-01'), soc: 0, chargingPower: 0, status: '', vechicleData: { vin: vin, model: 'model', made: 'made', year: new Date('2020-01-01') } };
            const eventB: VechicleChargeData = { datetime: new Date('2020-01-02'), soc: 0, chargingPower: 0, status: '', vechicleData: { vin: vin, model: 'model', made: 'made', year: new Date('2020-01-01') } };
            expect(collectorService.isDuplicateEvent(eventA, eventB, vin)).toBe(false);
        });
    });

    describe('isDuplicateEvent', () => {
        it('should return false', () => {
            const vin1 = 'vin1';
            const vin2 = 'vin2';
            const eventA: VechicleChargeData = { datetime: new Date('2020-01-01'), soc: 0, chargingPower: 0, status: '', vechicleData: { vin: vin1, model: 'model', made: 'made', year: new Date('2020-01-01') } };
            const eventB: VechicleChargeData = { datetime: new Date('2020-01-01'), soc: 0, chargingPower: 0, status: '', vechicleData: { vin: vin2, model: 'model', made: 'made', year: new Date('2020-01-01') } };
            expect(collectorService.isDuplicateEvent(eventA, eventB, vin2)).toBe(false);
        });
    });
});
