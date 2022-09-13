import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

const CountDown = () => {
    const [countdown, setCountdown] = useState('')

    useEffect(() => {
      let countdownInterv = null;
        countdownInterv = setInterval(() => {
            let now = new Date(),
             h = 23 - now.getHours(),
             m = 59 - now.getMinutes(),
             s = 59 - now.getSeconds();
            setCountdown(
                `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
                s < 10 ? "0" + s : s
                }`
            );
        }, 100);
    
        return () => clearInterval(countdownInterv);
    }, [])
    
  return (
    <p>{countdown}</p>
  )
}

export default CountDown