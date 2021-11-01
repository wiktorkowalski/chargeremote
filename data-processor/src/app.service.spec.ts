import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
    let appService: AppService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [AppService,
                {
                    provide: 'VECHICLE_CHARGE_DATA',
                    useValue: jest.fn()
                },
                {
                    provide: 'VECHICLE_CHARGE_STATS',
                    useValue: jest.fn()
                }],
        }).compile();

        appService = await app.resolve(AppService);
    });

    describe('calculateAverage', () => {
        it('should return 2', () => {
            expect(appService.calculateAverage([1, 2, 3])).toBe(2);
        });
    });

    describe('calculateAverage', () => {
        it('should return 5', () => {
            expect(appService.calculateAverage([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(5);
        });
    });

    describe('calculateAverage', () => {
        it('should return 0', () => {
            expect(appService.calculateAverage([])).toBe(0);
        });
    });
});
