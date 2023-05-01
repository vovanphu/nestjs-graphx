import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserManagementModule } from './user-management.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserManagementModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:rabbitmq@localhost:5672'],
        queue: 'USER_MANAGEMENT',
      },
    },
  );
  await app.listen();
}
bootstrap();
