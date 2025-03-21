import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import axios from "axios";
const TodoList = () => {
  // ✅ Define newTask state
  const [pendingCount, setPendingCount] = useState(0);
  


  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate(); // ✅ Add this for navigation

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // ✅ Remove the stored token
    localStorage.removeItem("refresh_token");
    alert("You have been logged out.");
    navigate("/login"); // ✅ Redirect to login page
  };


  // ✅ Refresh the access token if expired
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        console.log("No refresh token found. User must log in again.");
        return;
      }

      console.log("Refreshing token...");
      const response = await axios.post("https://todo-api-wdyb.onrender.com/refresh", {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });

      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        console.log("New access token set:", response.data.access_token);
      } else {
        console.log("Failed to refresh token.");
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      alert("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);



  // ✅ Function to fetch tasks, wrapped with useCallback
  const fetchTasks = useCallback(async () => {
    try {
      let token = localStorage.getItem("access_token");

      if (!token) {
        console.log("No access token found. Attempting refresh...");
        await refreshAccessToken();
        token = localStorage.getItem("access_token");
        if (!token) {
          alert("Session expired. Please log in again.");
          navigate("/login");
          return;
        }
      }

      console.log("Fetching tasks with token:", token);
      const response = await axios.get("https://todo-api-wdyb.onrender.com/tasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response || !response.data) {
        throw new Error("Failed to fetch tasks");
      }

      setTasks(response.data);
      const pendingTasks = response.data.filter(task => !task.done).length;
      setPendingCount(pendingTasks);
    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized error. Trying to refresh token...");
        await refreshAccessToken();
        fetchTasks();
      } else {
        alert("Error fetching tasks. Please check if the backend is running.");
      }
    }
  }, [refreshAccessToken, navigate]); 
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);



  // ✅ Add a new task
  const addTask = async () => {
    try {
        let token = localStorage.getItem("access_token");

        if (!token) {
            console.log("No access token found. Attempting refresh...");
            await refreshAccessToken();  // ✅ Refresh the token
            token = localStorage.getItem("access_token");
            if (!token) {
                alert("Session expired. Please log in again.");
                navigate("/login");
                return;
            }
        }

        if (!newTask.trim()) {
            alert("Task cannot be empty!");
            return;
        }

        console.log("Sending request to API:", { task: newTask.trim() });  // ✅ Debug log

        const response = await axios.post(
            "https://todo-api-wdyb.onrender.com/tasks",
            { task: newTask.trim() },  // ✅ No need for JSON.stringify()
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("API Response:", response.data);  // ✅ Debug response

        setTasks(prevTasks => {
          const updatedTasks = [...prevTasks, response.data];
          setPendingCount(updatedTasks.filter(task => !task.done).length); // ✅ Update pending count
          return updatedTasks;
      });

        setNewTask("");  // ✅ Clear input after adding task

    } catch (error) {
        console.error("Error adding task:", error.response ? error.response.data : error.message);
        alert("Error adding task. Check console for details.");
    }
};




  // ✅ Toggle task status (Done/Pending)
  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
        let token = localStorage.getItem("access_token");

        // ✅ If no access token, attempt to refresh
        if (!token) {
            console.log("No access token found. Attempting refresh...");
            await refreshAccessToken();  
            token = localStorage.getItem("access_token");  
            if (!token) {
                alert("Session expired. Please log in again.");
                navigate("/login");
                return;
            }
        }
        console.log(`Updating task ${taskId} to status: ${!currentStatus}`); 

        const response = await axios.put(
          `https://todo-api-wdyb.onrender.com/tasks/${taskId}`,
          JSON.stringify({ done: !currentStatus }),  // ✅ Send as JSON string
          {
              headers: {
                  "Content-Type": "application/json",  // ✅ Ensure correct format
                  Authorization: `Bearer ${token}`
              }
          }
      );
      console.log("API Response:", response);
      

        if (response.status !== 200) {
            throw new Error("Failed to update task.");
        }

        fetchTasks();  // ✅ Refresh task list
    } catch (error) {
        console.error("Error updating task:", error.response ? error.response.data : error.message);
        alert("Error updating task. Check console for details.");
    }
};

const clearAllTasks = async () => {
  try {
      let token = localStorage.getItem("access_token");

      if (!token) {
          alert("User not authenticated. Please log in again.");
          navigate("/login");
          return;
      }

      await axios.delete("https://todo-api-wdyb.onrender.com/tasks/clear", {
          headers: { "Authorization": `Bearer ${token}` }
      });

      fetchTasks();  // Refresh the task list
  } catch (error) {
      console.error("Error clearing tasks:", error.response ? error.response.data : error.message);
      alert("Error clearing tasks. Check console for details.");
  }
};



  // ✅ Delete a task
  const deleteTask = async (taskId) => {
    try {
        let token = localStorage.getItem("access_token");
        if (!token) {
            alert("No token found. Please log in again.");
            window.location.href = "/login";
            return;
        }

        const response = await fetch(`https://todo-api-wdyb.onrender.com/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        alert("Task deleted successfully!");
        fetchTasks(); // Refresh task list
    } catch (error) {
        alert("Error deleting task.");
        console.error(error);
    }
};


  // ✅ Fetch tasks when component loads
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Now `fetchTasks` is included in the dependency array safely

  return (
    <div className="todo-container">
      <h1 className="todo-title">Todo App</h1>
      
      <div className="input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="Add your new todo"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>+</button>
      </div>
      <div className="pending-tasks">
    You have {pendingCount} pending {pendingCount === 1 ? "task" : "tasks"}
</div>
  
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <span className={task.done ? "task-text task-done" : "task-text"}>
              {task.task}
            </span>
            <div className="task-actions">
              <input
                type="checkbox"
                checked={task.done || false}
                onChange={() => toggleTaskStatus(task.id, task.done)}
              />
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑</button>
            </div>
          </li>
        ))}

      </ul>

      {tasks.length > 0 && (
    <div className="clear-all">
        <button onClick={clearAllTasks} className="clear-btn">Clear All</button>
    </div>
)}

  
      <div className="logout-container">
    <button className="clear-btn" onClick={handleLogout}>Sign Out</button>
</div>

    </div>
  );
}  

export default TodoList;
