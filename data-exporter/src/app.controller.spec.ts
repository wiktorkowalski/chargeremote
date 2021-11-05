import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VechicleInfo } from './vechicleInfo';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService, useValue: { getEvInfo: jest.fn(), getEvsInfo: jest.fn() },
        },
        {
          provide: 'VECHICLE_DATA', useValue: jest.fn()
        },
        {
          provide: 'VECHICLE_CHARGE_STATS', useValue: jest.fn()
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('/evs', () => {
    it('should return VechicleInfo[]', async () => {
      const expected: VechicleInfo[] = [{ made: '', model: '', year: new Date(), vin: '', details: { averageChargingPower: 1, currentSoC: 1, currentStatus: '', datetime: new Date() } }];
      jest.spyOn(appService, 'getEvsInfo').mockResolvedValue(expected);
      const result = await appController.getEvsInfo();
      expect(result).toBe(expected);
    });
  });

  describe('/evs/:vin', () => {
    it('should return VechicleInfo', async () => {
      const expected: VechicleInfo = { made: '', model: '', year: new Date(), vin: '', details: { averageChargingPower: 1, currentSoC: 1, currentStatus: '', datetime: new Date() } };
      jest.spyOn(appService, 'getEvInfo').mockResolvedValue(expected);
      const result = await appController.getEvInfo('');
      expect(result).toBe(expected);
    });
  });
});
