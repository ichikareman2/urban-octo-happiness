import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { appendTask, deleteTask, Task, UnsavedTask, updateTask } from './task.model';
import { map, mapTo, take, tap } from 'rxjs/operators'
import { v4 as uuid } from 'uuid'

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private apiData = new BehaviorSubject<Task[]>([]);
  private getApiData$ = this.apiData.asObservable().pipe(take(1));
  constructor() { }

  get() {
    return this.getApiData$;
  }
  getAll() {
    return this.getApiData$;
  }
  post(task: UnsavedTask) {
    const newSavedTask: Task = {...task, id: uuid()}
    return this.getApiData$.pipe(
      map(appendTask(newSavedTask)),
      tap(this.apiData.next),
      mapTo(newSavedTask)
    );
  }
  put(task: Task) {
    return this.getApiData$.pipe(
      map(updateTask(task)),
      tap(this.apiData.next),
      mapTo(task)
    );
  }
  delete(id: string) {
    return this.getApiData$.pipe(
      map(deleteTask(id)),
      tap(this.apiData.next)
    );
  }
}
