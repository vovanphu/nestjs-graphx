import { ApolloDriver } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      isGlobal: true,
      cache: true,
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get('NODE_ENV') === 'development';
        const plugins = [];
        if (isDevelopment) {
          plugins.push(
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
          );
        }
        return {
          path: '/',
          autoSchemaFile: true,
          sortSchema: true,
          playground: false,
          plugins,
          includeStacktraceInErrorResponses: isDevelopment,
          context: ({ req, res }) => ({ req, res }),
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    TaskModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'USER_MANAGEMENT',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq-service:rabbitmq-service@localhost:5672'],
            queue: 'USER_MANAGEMENT',
          },
        }),
    },
    {
      provide: 'TASK_MANAGEMENT',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://rabbitmq-service:rabbitmq-service@localhost:5672'],
            queue: 'TASK_MANAGEMENT',
          },
        }),
    },
  ],
  exports: ['USER_MANAGEMENT', 'TASK_MANAGEMENT'],
})
export class GraphqlApiModule {}
