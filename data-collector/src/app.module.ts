import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { vechicleChargeDataProviders, vechicleDataProviders } from './app.providers';
import { CollectorService } from './collector.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ['.env.dev', '.env'] }), DatabaseModule, HttpModule],
  controllers: [AppController],
  providers: [CollectorService, ...vechicleDataProviders, ...vechicleChargeDataProviders],
})
export class AppModule { }
