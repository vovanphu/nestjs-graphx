import { NestFactory } from '@nestjs/core';
import { GraphqlApiModule } from './graphql-api.module';

async function bootstrap() {
  const app = await NestFactory.create(GraphqlApiModule);
  await app.listen(process.env.GRAPHQL_API_PORT);
}
bootstrap();
