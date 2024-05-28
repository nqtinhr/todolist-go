import "./App.scss";
import { useEffect, useState } from "react";
import { Todo } from "./@types/todo.type";
import { todoApi } from "./api/todos";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const doneTodos = todos?.filter((todo) => todo.complete) || [];
  const notdoneTodos = todos?.filter((todo) => !todo.complete) || [];
  

  useEffect(() => {
    (async () => {
      const data = await todoApi.getAll();
      setTodos(data);
    })();
  }, []);

  const addTodo = async (title: string) => {
    try {
      const todo = await todoApi.add({ title });
      setTodos((prev) => {
        if (!Array.isArray(prev)) {
          console.error('Previous state is not an array:', prev);
          return [todo];
        }
        return [todo, ...prev];
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDoneTodo = async (id: number, complete: boolean) => {
    try {
      const updatedTodo = await todoApi.update({ id, complete });
  
  
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
  
      console.log('Todo status updated successfully');
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const startEditTodo = (id: number) => {
    const findTodo = todos.find((todo) => todo.id === id);
    if (findTodo) {
      setCurrentTodo(findTodo);
    }
  };

  const editTodo = (title: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, title };
      return null;
    });
  };

  const finishEditTodo = async() => {
    try {
      if (currentTodo) {
        const updatedTodo = await todoApi.update(currentTodo);

        setTodos((prev) =>
          prev.map((todo) => (todo.id === currentTodo.id ? updatedTodo : todo))
        );
  
        console.log('Todo updated successfully');
      }
  
      // Reset the currentTodo
      setCurrentTodo(null);
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.remove(id.toString());

      setTodos(todos.filter((todo) => todo.id !== id));

      console.log("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="todolist-app">
      <div className="container">
        <TaskInput
          addTodo={addTodo}
          currentTodo={currentTodo}
          editTodo={editTodo}
          finishEditTodo={finishEditTodo}
        />
        <TaskList
          todos={notdoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  );
}

export default App;
