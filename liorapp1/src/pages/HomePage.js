import React, { useContext, useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import TaskList from "../components/tasks/TaskList";
import NewTask from "../components/tasks/NewTask";
import { TaskContext } from "../context/TaskContext";
import AuthForm from "../components/UI/AuthForm";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@mui/material";

const HomePage = () => {
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);
  const [searchKey, setSearchKey] = useState('')
  const [weatherState, setWeatherState] = useState({});
  const [quoteState, setQuoteState] = useState({});
  useEffect(() => {
    const fetchWeather = async () => {
      const weatherURL =
        "https://api.openweathermap.org/data/2.5/weather?lat=32.179359&lon=34.862770&units=metric&appid=3bd8b51a988a379555d53b284b106a47";
      try {
        const response = await fetch(weatherURL);
        if (!response.ok) {
          throw new Error("Couldnt fetch weather");
        }
        const data = await response.json();
        const main = data.main;
        setWeatherState({ temp: main.temp, tempFeel: main.feels_like });
      } catch (err) {
        console.log(err);
      }
    };
    const fetchQuote = async () => {
      const quoteURL =
        "https://api.api-ninjas.com/v1/quotes?category=happiness";
      try {
        const response = await fetch(quoteURL, {
          headers: { "X-Api-Key": "txnyhSMqqKW6yX5cN00ZFA==emXIu3jN0hhIpR1f" },
        });
        if (!response.ok) {
          throw new Error("Couldn't fetch the quote");
        }
        const data = await response.json();
        setQuoteState({ quote: data[0].quote, author: data[0].author });
      } catch (err) {
        console.log(err);
      }
    }; 
    fetchQuote();
    fetchWeather();
  }, []);

  useEffect(() => {
    taskCtx.updateTasks(searchKey)
  }, [searchKey])
 
  return (
    <React.Fragment>
      {authCtx.window && <AuthForm/>}
      <div className={styles.pageName}>Home</div>
      <div className={styles.search}>
        <label>Filter by a keyword or status</label>
        <input type="text" onChange={(e) => {
          setSearchKey(e.target.value)}}/>
      </div>
      <div className={styles.mainBracket}>
        <div className={styles.weatherBracket}>
          <div className={styles.temp}> temp: {weatherState.temp}</div>
          <div className={styles.tempFeel}>
            feels_like: {weatherState.tempFeel}
          </div>
        </div>
        <div className={styles.quoteBracket}>
          <div className={styles.quote}>quote: {quoteState.quote}</div>
          <div className={styles.author}>author: {quoteState.author}</div>
        </div>
      </div>
      <Button className={styles.taskButton} disabled={!authCtx.logged} onClick={() => taskCtx.toggleWindow(true)} variant="outlined">New Task</Button>
      <TaskList search={searchKey}/>
      {taskCtx.window && <NewTask/>}
    </React.Fragment>

  );
};

export default HomePage;
