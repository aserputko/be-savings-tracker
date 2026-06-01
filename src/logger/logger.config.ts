import 'dotenv/config';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

const isProduction = process.env['NODE_ENV'] === 'production';

export const winstonConfig: winston.LoggerOptions = {
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    isProduction
      ? winston.format.json()
      : winston.format.combine(
          nestWinstonModuleUtilities.format.nestLike('SavingsTracker', {
            colors: true,
            prettyPrint: true,
          }),
        ),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
  exitOnError: false,
};

function buildLokiTransport(): LokiTransport | null {
  const lokiHost = process.env['LOKI_HOST'];
  if (!lokiHost) return null;

  return new LokiTransport({
    host: lokiHost,
    labels: {
      app: 'savings-tracker',
      env: process.env['NODE_ENV'] ?? 'development',
    },
    json: true,
    batching: true,
    interval: 5,
    replaceTimestamp: false,
    onConnectionError: (err) => console.error('Loki connection error:', err),
  });
}

const lokiTransport = buildLokiTransport();
if (lokiTransport) {
  (winstonConfig.transports as winston.transport[]).push(lokiTransport);
}
