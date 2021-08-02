import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { withLatestFrom, tap, map, mergeMap, mapTo } from 'rxjs/operators';
import { TaskTimeApiService } from './task-time-api.service';
import { appendTaskTime, deleteTaskTime, TaskTime, TaskTimeList, UnsavedTaskTime, updateTaskTime } from './task-time.model';

@Injectable({
  providedIn: 'root'
})
export class TaskTimeService {
  private taskTimesRecord = new BehaviorSubject<Record<string, TaskTimeList>>({});
  private loadingTaskTimes = new BehaviorSubject<Record<string, boolean>>({});

  public taskTimesRecord$ = this.taskTimesRecord.asObservable();
  public loadingTaskTimes$ = this.loadingTaskTimes.asObservable();
  constructor(
    private taskTimeApi: TaskTimeApiService
  ) { }

  loadTaskTimeByTaskId(taskId: string): Observable<TaskTimeList> {
    return this.taskTimeApi.get(taskId).pipe(
      this.updateTaskTimeRecordItem(taskId)
    )
  }

  addTaskTime(taskTime: UnsavedTaskTime): Observable<TaskTime> {
    return this.taskTimeApi.post(taskTime).pipe(
      withLatestFrom(this.taskTimesRecord$),
      mergeMap(([createdTaskTime, taskTimesRecord]) => {
        const newRecordItem = appendTaskTime(createdTaskTime, taskTimesRecord[taskTime.taskId]);
        const newTaskTimeRecord = {
          ...taskTimesRecord,
          [createdTaskTime.taskId]: newRecordItem
        };
        return of(newTaskTimeRecord).pipe(
          this.updateTaskTimeRecord,
          mapTo(createdTaskTime)
        );
      })
    );
  }

  updateTaskTime(_taskTime: TaskTime): Observable<TaskTime> {
    return this.taskTimeApi.put(_taskTime).pipe(
      withLatestFrom(this.taskTimesRecord$),
      mergeMap(([taskTime, taskTimesRecord]) => {
        const newRecordItem = updateTaskTime(taskTime)(taskTimesRecord[taskTime.taskId]);
        const newTaskTimeRecord = {
          ...taskTimesRecord,
          [taskTime.taskId]: newRecordItem
        };
        return of(newTaskTimeRecord).pipe(
          this.updateTaskTimeRecord,
          mapTo(_taskTime)
        );
      })
    );
  }

  deleteTaskTime(id: string): Observable<boolean> {
    return this.taskTimeApi.delete(id);
  }

  private updateTaskTimeRecord = pipe(
    tap(this.taskTimesRecord.next)
  )
  private updateTaskTimeRecordItem = (taskId: string) => pipe(
    withLatestFrom<TaskTimeList, Observable<Record<string, TaskTimeList>>>(this.taskTimesRecord$),
    map(([taskTimeList, taskTimeRecord]) => ({ ...taskTimeRecord, [taskId]: taskTimeList })),
    this.updateTaskTimeRecord,
    map(taskTimeRecord => taskTimeRecord[taskId])
  );
}
