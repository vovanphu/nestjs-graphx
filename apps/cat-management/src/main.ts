import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CatConfigModule } from './cat-config.module';
import { CatManagementModule } from './cat-management.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    CatConfigModule,
  );
  const configService = appContext.get(ConfigService);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatManagementModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('CAT_MANAGEMENT_RMQ_URL')],
        queue: configService.get<string>('CAT_MANAGEMENT_RMQ_QUEUE'),
      },
    },
  );
  await app.listen();
}
bootstrap();
