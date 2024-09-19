import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { useControls } from "leva";
import { Game } from "./Game";
import "./styles.css";

const App = () => {
  const { totalShells, duration, totalShuffles} = useControls({
    totalShells: {
      min: 3,
      max: 7,
      value: 5,
      step: 2,
    },
    duration: {
      min: 100,
      max: 500,
      value: 300,
    },
    totalShuffles: {
      min: 2,
      max: 30,
      value: 5,
      step: 1
    },
  });
  return <Game totalShells={totalShells} duration={duration} totalShuffles={totalShuffles} />;
};


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Suspense>
    <App />
  </Suspense>
);
