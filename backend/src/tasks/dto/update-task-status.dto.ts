import { IsEnum } from "class-validator";
import { TaskStatus } from "src/tasks/task-status";

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus
}