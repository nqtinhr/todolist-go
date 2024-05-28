import { ChangeEvent } from 'react'
import './TaskList.scss'
import { Todo } from '../../@types/todo.type'

export interface TaskListProps {
  doneTaskList?: boolean
  todos: Todo[]
  handleDoneTodo: (id: number, done: boolean) => void
  startEditTodo: (id: number) => void
  deleteTodo: (id: number) => void
}

export function TaskList(props: TaskListProps) {
  const { doneTaskList, todos, handleDoneTodo, startEditTodo, deleteTodo } = props

  const onChangeCheckbox = (idTodo: number) => (event: ChangeEvent<HTMLInputElement>) => {
    handleDoneTodo(idTodo, event.target.checked)
  }

  return (
    <div className='mb-2'>
      <h2 className="title">{doneTaskList ? 'Complete' : 'Improgress'}</h2>
      <div className="tasks">
        {todos.map((todo) => (
          <div className="task" key={todo.id}>
            <input
              type='checkbox'
              className="taskCheckbox"
              checked={todo.complete}
              onChange={onChangeCheckbox(todo.id)}
            />
            <span className={`taskName ${todo.complete ? "taskNameDone" : ''}`}>{todo.title}</span>
            <div className="taskActions">
              <button className="taskBtn edit" onClick={() => startEditTodo(todo.id)}>
                🖊️
              </button>
              <button className="taskBtn remove" onClick={() => deleteTodo(todo.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


