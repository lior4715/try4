import React, { createContext, useReducer, useEffect } from "react";

const loader = async () => {
  try {
    const response = await fetch("http://localhost:8080/tasks");
    if (!response.ok) {
      throw new Error((await response).statusText);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const defaultTaskState = { tasks: [], window: false };

const taskReducer = (state, action) => {
  if (action.type === "ADD") {
    return { tasks: [...state.tasks, action.task], window: false };
  } else if (action.type === "INIT") {
    return { tasks: action.tasks, window: state.window };
  } else if (action.type === "SHOW") {
    return { tasks: state.tasks, window: action.window };
  } else if (action.type === "DELETE") {
    return {
      tasks: state.tasks.filter((task) => task.id !== action.id),
      window: action.window,
    };
  } else if (action.type === "PATCH") {
    const index = state.tasks.findIndex((task) => task.id === action.id);
    const tasks = state.tasks;
    const task = tasks[index];
    task.status = action.status;
    tasks[index] = task;
    return { tasks: tasks, window: state.window };
  } else if (action.type === "UPDATE") {
    return { tasks: action.tasks, window: state.window };
  }
};

export const TaskContext = createContext();

export const TaskProvider = (props) => {
  const [taskState, dispatchTaskAction] = useReducer(
    taskReducer,
    defaultTaskState
  );
  useEffect(() => {
    const loadInitialTasks = async () => {
      const initialTasks = await loader();
      dispatchTaskAction({ type: "INIT", tasks: initialTasks });
    };
    loadInitialTasks();
  }, []);

  const addTask = async (task, aKey) => {
    try {
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${aKey}`,
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error((await response).statusText);
      } else {
        const data = await response.json();
        dispatchTaskAction({ type: "ADD", task: data });
      }
    } catch (err) {
      console.log("Error fetching the task", err);
    }
  };

  const deleteTask = async (id, aKey) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${aKey}`,
        },
      });
      if (!response.ok) {
        const errData = await response.json();
        return errData;
      } else {
        dispatchTaskAction({ type: "DELETE", id: id });
      }
    } catch (err) {
      console.log("Error most likely in fetching desired deleted task ", err);
    }
  };

  const updateTasks = async (searchInfo) => {
    try {
      const response = await fetch(
        `http://localhost:8080/tasks?search=${searchInfo}`
      );
      if (!response.ok) {
        const errData = await response.json();
        return errData.message;
      } else {
        const tasks = await response.json();
        dispatchTaskAction({ type: "UPDATE", tasks: tasks });
      }
    } catch (err) {
      console.log("Error most likely in fetching tasks ", err);
    }
  };

  const editTaskStatus = async (id, status, aKey) => {
    console.log(aKey)
    try {
      const response = await fetch(`http://localhost:8080/tasks/${id}/status`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aKey}`
      },
        body: JSON.stringify({ status: status }),
      });
      if (!response.ok) {
        const errData = await response.json();
        return errData;
      } else {
        dispatchTaskAction({ type: "PATCH", status: status, id: id });
      }
    } catch (err) {
      console.log("Error most likely in fetching ", err);
    }
  };

  const toggleWindow = (window) => {
    dispatchTaskAction({ type: "SHOW", window: window });
  };

  const taskContext = {
    tasks: taskState.tasks,
    window: taskState.window,
    addTask: addTask,
    deleteTask: deleteTask,
    editTaskStatus: editTaskStatus,
    toggleWindow: toggleWindow,
    updateTasks: updateTasks,
  };

  return (
    <TaskContext.Provider value={taskContext}>
      {props.children}
    </TaskContext.Provider>
  );
};
