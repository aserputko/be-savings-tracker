import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { winstonConfig } from './logger/logger.config';
import { AuthModule } from './modules/auth/auth.module';
import { SavingsGoalModule } from './modules/savings-goal/savings-goal.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot(winstonConfig),
    PrismaModule,
    AuthModule,
    SavingsGoalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
