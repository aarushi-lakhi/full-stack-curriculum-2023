import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

export default function HomePage() {
  const navigate = useNavigate();

  const {currentUser} = useAuth();

    // State to hold the list of tasks.
    const [tasks, setTasks] = useState([
      // Sample tasks to start with.
      /*{ name: "create a todo app", finished: false },
      { name: "wear a mask", finished: false },
      { name: "play roblox", finished: false },
      { name: "be a winner", finished: true },
      { name: "become a tech bro", finished: true },*/
    ]);

  useEffect(() => {
    if (!currentUser) {
      //kick them out
      navigate("/login")
    }
    getTasks(currentUser.username);
  }, [currentUser])



  // State for the task name being entered by the user.
  const [taskName, setTaskName] = useState("");

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.

  //Updates tasks accordingly
  function getTasks(user) {
    fetch(`http://localhost:3001/tasks/${user}`)
      .then((response) => response.json())
      .then((data) => {
        // data = data.filter((item) => item.finished);
        const mappedData = data.map((item) => {
          return {id: item.id, name : item.task, finished: item.finished};
        })
        console.log(data);
        setTasks(mappedData);
      });
  }

  function addTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (taskName && !tasks.some((task) => task.name === taskName)) {

      // TODO: Support adding todo items to your todo list through the API.
      // In addition to updating the state directly, you should send a request
      // to the API to add a new task and then update the state based on the response.
      fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers : {
          "Content-Type": "application/json",
          //"Accept": "application/json",
        },
        body: JSON.stringify({
          "userID": currentUser.username,
          "task": taskName,
          "finished": false
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setTasks([...tasks, { name: taskName, finished: false, id: data.id }]); 
        });
      setTaskName("");
    } else if (tasks.some((task) => task.name === taskName)) {
      alert("Task already exists!");
    }
  }

  // Function to toggle the 'finished' status of a task.
  function updateTask(name) {
    setTasks(
      tasks.map((task) =>
        task.name === name ? { ...task, finished: !task.finished } : task
      )
    );

    // TODO: Support removing/checking off todo items in your todo list through the API.
    // Similar to adding tasks, when checking off a task, you should send a request
    // to the API to update the task's status and then update the state based on the response.

    //remove finished tasks
    tasks.forEach((task) => {
      if (task.finished) {
        fetch(`http://localhost:3001/tasks/${task.id}`, {
          method: "DELETE",
          headers : {
            // "Content-Type": "application/json",
            "accept": "application/json",
          },
        })
        .then((response) => response.json())
        .then(() => {
          const unfinishedTasks = tasks.filter((task) => !task.finished);
          console.log(unfinishedTasks)
          setTasks(unfinishedTasks);
        })
      }
    })
  }

  // Function to compute a message indicating how many tasks are unfinished.
  function getSummary() {
    const unfinishedTasks = tasks.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getSummary()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={taskName}
                  placeholder="Type your task here"
                  onChange={(event) => setTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {tasks.map((task) => (
                <ListItem
                  key={task.name}
                  dense
                  onClick={() => updateTask(task.name)}
                >
                  <Checkbox
                    checked={task.finished}
                  />
                  <ListItemText primary={task.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}
