import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CollectorService } from './collector.service';

describe('AppController', () => {
  let appController: AppController;
  let collectorService: CollectorService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: CollectorService, useValue: { startImport: jest.fn() }
        },
        {
          provide: 'VECHICLE_DATA', useValue: jest.fn()
        },
        {
          provide: 'VECHICLE_CHARGE_DATA', useValue: jest.fn()
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    collectorService = app.get<CollectorService>(CollectorService);
  });

  describe('startImport', () => {
    it('should return {"isSuccess": true}', async () => {
      const expected = { isSuccess: true };
      jest.spyOn(collectorService, 'startImport').mockResolvedValue(expected);
      const result = await appController.startImport();
      expect(result).toBe(expected);
    });
  });

  describe('startImport', () => {
    it('should return {"isSuccess": false} with message', async () => {
      const expected = { isSuccess: false, message: 'error' };
      jest.spyOn(collectorService, 'startImport').mockResolvedValue(expected);
      const result = await appController.startImport();
      expect(result).toBe(expected);
    });
  });
});
