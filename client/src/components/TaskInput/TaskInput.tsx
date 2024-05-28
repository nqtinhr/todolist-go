import "./TaskInput.scss";
import { ChangeEvent, FormEvent, useState } from "react";
import { Todo } from "../../@types/todo.type";

export interface TaskInputProps {
  addTodo: (name: string) => void;
  editTodo: (name: string) => void;
  finishEditTodo: () => void;
  currentTodo: Todo | null;
}

export function TaskInput(props: TaskInputProps) {
  const { addTodo, editTodo, currentTodo, finishEditTodo } = props;
  const [title, setTitle] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentTodo) {
      finishEditTodo();
      setTitle("");
    } else {
      addTodo(title);
      setTitle("");
    }
  };
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (currentTodo) {
      editTodo(value);
    } else {
      setTitle(value);
    }
  };

  return (
    <div className="mb-2">
      <h1 className="title">Todolist</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="caption goes here"
          value={currentTodo ? currentTodo.title : title}
          onChange={handleOnChange}
        />
        <button type="submit">{currentTodo ? "✔️" : "➕"}</button>
      </form>
    </div>
  );
}
