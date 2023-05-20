import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TaskManagementModule } from './task-management.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TaskManagementModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqp://rabbitmq-service:rabbitmq-service@rabbitmq-service:5672',
        ],
        queue: 'TASK_MANAGEMENT',
      },
    },
  );
  await app.listen();
}
bootstrap();
