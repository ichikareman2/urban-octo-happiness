import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskApiService } from './task-api.service';
import { Task, TaskList, UnsavedTask } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskListSubj = new BehaviorSubject<TaskList>([]);
  public taskList$ = this.taskListSubj.asObservable();
  constructor(
    private taskApiService: TaskApiService
  ) { }

  loadTasks () {
    this.taskApiService.getAll().subscribe(this.taskListSubj.next);
  }
  createTask(task: UnsavedTask) {
    return this.taskApiService.post(task);
  }
  updateTask(task: Task) {
    return this.taskApiService.put(task);
  }
  deleteTask(id: string) {
    return this.taskApiService.delete(id);
  }
}
