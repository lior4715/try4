import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TaskRepository) {}

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const record = await this.tasksRepository.findOne({ where: { id, user } });
    if (!record) {    // error ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      throw new NotFoundException();
    }
    return record;
  }

  deleteTask(id: string) {
    return this.tasksRepository.deleteTask(id);
  }
 
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    try {
      task.status = status;
      await this.tasksRepository.save(task);
      return task;
    } catch (err) {
      console.log('user input given to service wasnt good', err)
    }
    
  }
}
