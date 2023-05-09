import { TypeOrmCrudService } from '@app/crud';
import { Task, TaskDto } from '@app/entities/task.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskManagementService extends TypeOrmCrudService<Task, TaskDto> {
  constructor(@InjectRepository(Task) repo: Repository<Task>) {
    super(repo);
  }
}
