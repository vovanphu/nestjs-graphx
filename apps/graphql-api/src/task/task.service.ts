import { ClientCrudService } from '@app/crud';
import { Task } from '@app/entities/task.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TaskService extends ClientCrudService(Task) {
  constructor(@Inject('TASK_MANAGEMENT') readonly client: ClientProxy) {
    super(client);
  }
}
