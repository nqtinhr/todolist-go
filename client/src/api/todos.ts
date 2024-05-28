import { Todo } from '../@types/todo.type';
import { axiosInstance } from './axiosInstance';

export const todoApi = {
  getAll(): Promise<Todo[]> {
    const url = '/todos';
    return axiosInstance.get(url);
  },
  getById(id: string): Promise<Todo> {
    const url = `/todos/${id}`;
    return axiosInstance.get(url);
  },

  add(data: Partial<Todo>): Promise<Todo> {
    const url = '/todos';
    return axiosInstance.post(url, data);
  },
  update(data: Partial<Todo>): Promise<Todo> {
    const url = `/todos/${data.id}`;
    return axiosInstance.patch(url, data);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(id: string): Promise<any> {
    const url = `/todos/${id}`;
    return axiosInstance.delete(url);
  },
};
