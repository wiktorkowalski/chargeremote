import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { vechicleChargeStatsProviders, vechicleDataProviders } from './app.providers';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: ['.env.dev', '.env'] }), DatabaseModule,],
  controllers: [AppController],
  providers: [AppService, ...vechicleChargeStatsProviders, ...vechicleDataProviders],
})
export class AppModule { }
