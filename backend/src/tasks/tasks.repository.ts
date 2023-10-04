import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
// @InjectRepository(User) private readonly userRepository: Repository<User>,
@Injectable()
export class TaskRepository {
  [x: string]: any;
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { search } = filterDto;
    console.log(search);
    const query = this.taskRepository.createQueryBuilder('task');
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search) OR LOWER(task.status) LIKE LOWER(:search)',
        { search: `%${search}%` }, // check if it works without %
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string) {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} wasn't found!`);
    }
  }
}
