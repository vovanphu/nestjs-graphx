import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [
    {
      provide: 'USER_MANAGEMENT',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq:rabbitmq@localhost:5672'],
            queue: 'USER_MANAGEMENT',
          },
        }),
    },
    UserService,
    UserResolver,
  ],
  exports: [],
})
export class UserModule {}
