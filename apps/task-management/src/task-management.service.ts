import { TypeOrmCrudServiceFactory } from '@app/crud';
import { Task } from '@app/entities/task.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskManagementService extends TypeOrmCrudServiceFactory(Task) {}
