import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('CAT_MANAGEMENT_DB_HOST'),
          port: +configService.get('CAT_MANAGEMENT_DB_PORT'),
          username: configService.get('CAT_MANAGEMENT_DB_USERNAME'),
          password: configService.get('CAT_MANAGEMENT_DB_PASSWORD'),
          database: configService.get('CAT_MANAGEMENT_DB_DATABASE'),
          timezone: 'Z',
          synchronize: configService.get('NODE_ENV') === 'development',
          global: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    CatModule,
  ],
  controllers: [],
  providers: [],
})
export class CatManagementModule {}
