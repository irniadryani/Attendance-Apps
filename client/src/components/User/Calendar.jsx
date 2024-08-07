import React, { useState } from "react";
import Calendar from "react-calendar";
import "./Calendar.css";

export default function Calendarr() {
  const [date, setDate] = useState(new Date());
  return (
    <div>
      <div className="w-full">
        <div className="app">
          <h1 className="text-center">React Calendar</h1>
          <div className="calendar-container">
            <Calendar onChange={setDate} value={date} />
          </div>
          <p className="text-center">
            <span className="bold">Selected Date:</span> {date.toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
