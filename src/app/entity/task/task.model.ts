import * as R from 'ramda';
/** Task object describing the task */
export interface Task {
  /** identifier */
  id: string;
  /** name of task */
  name: string;
  /** description of task */
  description: string;
}

export interface UnsavedTask extends Omit<Task, 'id'> { }

export interface TaskList extends Array<Task> { }

const idLens = R.lens<Task, string>(R.prop('id'), R.assoc('id'));
export const getId = (x: Task) => x?.id;
export const sameId = R.eqBy(getId);

export const appendTask = (task: Task) =>
  (taskList: TaskList): TaskList =>
    R.append(task, taskList);

export const updateTask = (task: Task) =>
  (taskList: TaskList): TaskList =>
    R.pipe(
      R.findIndex<Task>(sameId(task)),
      R.partialRight<TaskList>(R.update, [task, taskList])
    )(taskList);

export const deleteTask = (id: string) =>
  (taskList: TaskList) =>
    R.pipe(
      R.findIndex<Task>(item => R.view(idLens, item) === id),
      R.partialRight<number, number, TaskList, TaskList>(R.remove, [1, taskList])
    )(taskList);

export function findTask(id: string, taskList: TaskList) {
  return R.find(item => R.view(idLens, item) === id, taskList)
}
