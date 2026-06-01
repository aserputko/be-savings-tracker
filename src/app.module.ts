import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { WinstonModule } from 'nest-winston';
import { ClsModule } from 'nestjs-cls';
import { randomUUID } from 'node:crypto';
import { winstonConfig } from './logger/logger.config';
import { AuthModule } from './modules/auth/auth.module';
import { SavingsGoalModule } from './modules/savings-goal/savings-goal.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: { headers: Record<string, string | string[] | undefined> }) =>
          (req.headers['x-request-id'] as string) ?? randomUUID(),
      },
    }),
    WinstonModule.forRoot(winstonConfig),
    PrismaModule,
    AuthModule,
    SavingsGoalModule,
  ],
})
export class AppModule {}
