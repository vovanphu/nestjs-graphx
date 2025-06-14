import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GraphqlConfigModule } from './graphql-config.module';
import { GraphqlApiModule } from './graphql-gateway.module';

async function bootstrap() {
  const configContext = await NestFactory.createApplicationContext(
    GraphqlConfigModule,
  );
  const configService = configContext.get(ConfigService);
  const app = await NestFactory.create(GraphqlApiModule);
  await app.listen(configService.get('GRAPHQL_GATEWAY_PORT'));
}
bootstrap();
