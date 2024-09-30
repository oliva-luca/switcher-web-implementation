import React, { useEffect } from "react";

interface TimerProps {
    minutes: number;
    seconds: number;
}

function Timer() {
    const [minutes, setMinutes] = React.useState(2);
    const [seconds, setSeconds] = React.useState(0);
    const [isActive, setIsActive] = React.useState(false);

    useEffect(() => {
        let intervalId: any;
        if (isActive) {
            intervalId = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(intervalId);
                        setIsActive(false);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }
    , [isActive, minutes, seconds]);

    const toggle = () => {
        setIsActive(!isActive);
    }

    const reset = () => {
        setMinutes(2);
        setSeconds(0);
        setIsActive(false);
    }

    return (
        <div>
            <h1>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
            <button onClick={toggle}>{isActive ? 'Pause' : 'Start'}</button>
            <button onClick={reset}>Reset</button>
        </div>
    )
}

export default Timer;