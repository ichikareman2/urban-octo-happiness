import * as R from 'ramda';
import { v4 as uuid } from 'uuid';
export interface TaskTime {
  /** identifier */
  id: string;
  /** id of the task this time belongs to */
  taskId: string;
  /** remarks about the time */
  remarks: string;
  /** start time of task time. ISO date format */
  startDateTime: string;
  /** end time of task time. ISO date format */
  endDateTime: string;
}

export interface UnsavedTaskTime extends Omit<TaskTime, 'id'> { }
export interface TaskTimeList extends Array<TaskTime> { }

export const createNewTasktime = (unsavedTaskTime: UnsavedTaskTime) => ({
  ...unsavedTaskTime,
  id: uuid()
});

export const getId = (x: TaskTime) => x.id;
export const getTaskId = (x: TaskTime) => x.taskId;
export const filterByTaskId = (taskId: string) => R.filter(R.pipe(getTaskId, R.equals(taskId)));
export const sameId = R.eqBy(getId);
export const appendTaskTime = R.append;
export const updateTaskTime = (time: TaskTime) =>
  (timeList: TaskTimeList): TaskTimeList =>
    R.pipe(
      R.findIndex<TaskTime>(sameId(time)),
      R.partialRight<TaskTimeList>(R.update, [time, timeList])
    )(timeList);
export const deleteTaskTime = (id: string) => (timeList: TaskTimeList) => R.pipe(
  R.findIndex<TaskTime>(R.pipe(getId, R.equals(id))),
  R.partialRight<TaskTimeList>(R.remove, [1, timeList])
)(timeList);
export const findTaskTime = (id: string) => R.find(R.pipe(getId, R.equals(id)));
