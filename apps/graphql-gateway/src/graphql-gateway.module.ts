import { ApolloDriver } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { CatModule } from './cat/cat.module';
import { GraphqlConfigModule } from './graphql-config.module';

@Global()
@Module({
  imports: [
    GraphqlConfigModule,
    GraphQLModule.forRootAsync({
      imports: [GraphqlConfigModule],
      inject: [ConfigService],
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
          playground: false,
          plugins,
          includeStacktraceInErrorResponses: isDevelopment,
          context: ({ req, res }) => ({ req, res, dataloader: new Map() }),
        };
      },
    }),
    CatModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'CAT_MANAGEMENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('CAT_MANAGEMENT_RMQ_URL')],
            queue: configService.get<string>('CAT_MANAGEMENT_RMQ_QUEUE'),
          },
        }),
    },
  ],
  exports: ['CAT_MANAGEMENT'],
})
export class GraphqlApiModule {}
