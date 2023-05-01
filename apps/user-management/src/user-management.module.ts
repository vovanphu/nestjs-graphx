import { UserEntity } from '@app/entities';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';

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
          host: configService.get('USER_MANAGEMENT_DB_HOST'),
          port: +configService.get('USER_MANAGEMENT_DB_PORT'),
          username: configService.get('USER_MANAGEMENT_DB_USERNAME'),
          password: configService.get('USER_MANAGEMENT_DB_PASSWORD'),
          database: configService.get('USER_MANAGEMENT_DB_DATABASE'),
          timezone: 'Z',
          synchronize: configService.get('NODE_ENV') === 'development',
          global: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService],
})
export class UserManagementModule {}
