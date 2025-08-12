import React from "react";

import EventCalendar from "./EventCalendar";
import PageTitle from "../../../layouts/PageTitle";
// import PageTitle from "../../../layouts/PageTitle";

const Calendar = () => {
   return (
      <div className="h-80">
         <PageTitle pageContent="Calender"  activeMenu="Calender" motherMenu="App" />        
         <EventCalendar />
         
      </div>
   );
};

export default Calendar;
