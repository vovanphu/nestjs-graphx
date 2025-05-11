import { MicroserviceCrudControllerFactory } from '@app/crud';
import { Task } from '@app/entities/task.entity';
import { Controller } from '@nestjs/common';
import { TaskManagementService } from './task-management.service';

@Controller()
export class TaskManagementController extends MicroserviceCrudControllerFactory(
  Task,
) {
  constructor(private readonly taskManagementService: TaskManagementService) {
    super(taskManagementService);
  }
}
