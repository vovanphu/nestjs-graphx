import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { UserModule } from './user.module';

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
  ],
  controllers: [],
  providers: [],
})
export class GraphqlApiModule {}
