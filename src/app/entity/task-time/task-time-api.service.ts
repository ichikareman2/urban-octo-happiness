import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { map, take, withLatestFrom, mergeMap, mapTo, tap } from 'rxjs/operators';
import { appendTaskTime, createNewTasktime, deleteTaskTime, filterByTaskId, TaskTime, TaskTimeList, UnsavedTaskTime, updateTaskTime } from './task-time.model';
import { v4 as uuid } from 'uuid'
export interface TaskTimeGetFilter {
  taskId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskTimeApiService {
  private apiData = new BehaviorSubject<TaskTimeList>([]);
  private getApiData$ = this.apiData.asObservable().pipe(take(1));

  constructor() { }

  get(taskId: string): Observable<TaskTimeList> {
    return this.getApiData$.pipe(map(filterByTaskId(taskId)));
  }
  post(taskTime: UnsavedTaskTime): Observable<TaskTime> {
    const newTaskTime = createNewTasktime(taskTime);
    return of(newTaskTime).pipe(
      withLatestFrom(this.getApiData$),
      map(([createdTaskTime, taskTimes]) => appendTaskTime(createdTaskTime, taskTimes)),
      this.updateTaskTimeRecord,
      mapTo(newTaskTime)
    );
  }
  put(_taskTime: TaskTime): Observable<TaskTime> {
    return this.getApiData$.pipe(
      map(updateTaskTime(_taskTime)),
      this.updateTaskTimeRecord,
      mapTo(_taskTime)
    );
  }
  delete(id: string): Observable<true> {
    return this.getApiData$.pipe(
      map(deleteTaskTime(id)),
      this.updateTaskTimeRecord,
      mapTo(true)
    );
  }

  private updateTaskTimeRecord = pipe(tap(this.apiData.next));
}
