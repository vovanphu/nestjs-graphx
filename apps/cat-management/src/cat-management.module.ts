import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatConfigModule } from './cat-config.module';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [
    CatConfigModule,
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
