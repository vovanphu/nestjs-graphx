import { Task } from '@app/entities/task.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskManagementController } from './task-management.controller';
import { TaskManagementService } from './task-management.service';

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
          host: configService.get('TASK_MANAGEMENT_DB_HOST'),
          port: +configService.get('TASK_MANAGEMENT_DB_PORT'),
          username: configService.get('TASK_MANAGEMENT_DB_USERNAME'),
          password: configService.get('TASK_MANAGEMENT_DB_PASSWORD'),
          database: configService.get('TASK_MANAGEMENT_DB_DATABASE'),
          timezone: 'Z',
          synchronize: configService.get('NODE_ENV') === 'development',
          global: true,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [TaskManagementController],
  providers: [TaskManagementService],
})
export class TaskManagementModule {}
