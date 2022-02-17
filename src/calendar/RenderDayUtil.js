import {addDays, isAfter, isBefore, isSameDay} from "date-fns";
import {PickersDay} from "@mui/lab";
import * as React from "react";

export default class RenderDayUtil {

  static render(day, DayComponentProps,bookedDays,arrivalDay,departureDay) {

    let beginDayList = bookedDays.map(({begin}) => {
      return begin
    });
    let endDayList = bookedDays.map(({end}) => {
      return end
    });

    let bookingsOfDay = bookedDays.filter((item) => item.containsDay(day));
    let title = "";
    if(bookingsOfDay != null) {
      for(let b in bookingsOfDay)   {
        title += bookingsOfDay[b].name + " hat gebucht vom "+
          bookingsOfDay[b].getBegin().getDate() +"."+bookingsOfDay[b].getBegin().getMonth()+
          " bis zum "+bookingsOfDay[b].getEnd().getDate() +"."+bookingsOfDay[b].getEnd().getMonth() +"    ";
      }
    }

    //overlapping days

    if (beginDayList.find((item) => isSameDay(item, day)) &&
      (departureDay != null && isSameDay(departureDay, day) ||
        arrivalDay != null && isSameDay(arrivalDay, day))) {
      return <PickersDay {...DayComponentProps} title={title} selected={true} disableMargin={true} className="selected_booked_cross"/>
    }
    if (endDayList.find((item) => isSameDay(item, day)) &&
      arrivalDay != null && isSameDay(arrivalDay, day)) {
      return <PickersDay {...DayComponentProps} title={title} selected={true} disableMargin={true} className="booked_selected_cross"/>
    }
    if (beginDayList.find((item) => isSameDay(item, day)) && endDayList.find((item) => isSameDay(item, day))) {
      return <PickersDay {...DayComponentProps} title={title} disabled={true} disableMargin={true} className="bookedDay_double bookedDay"/>
    }

    //render booked days

    if (beginDayList.find((item) => isSameDay(item, day))) {
      return <PickersDay {...DayComponentProps} title={title} disabled={false} disableMargin={true} className="bookedDay_begin bookedDay"/>
    }
    if (endDayList.find((item) => isSameDay(item, day))) {
      return <PickersDay {...DayComponentProps} title={title} disabled={false} disableMargin={true} className="bookedDay_end bookedDay"/>
    }
    if (bookedDays.find((item) => item.isInnerDay(day))) {
      return <PickersDay {...DayComponentProps} title={title} disabled={true} disableMargin={true} className="bookedDay_reg bookedDay"/>
    }
    //render selected days

    if (arrivalDay != null && isSameDay(arrivalDay, day)) {
      return <PickersDay {...DayComponentProps} disableMargin={true} className="selectedDay_begin selectedDay"/>
    }
    if (departureDay != null && isSameDay(departureDay, day)) {
      return <PickersDay {...DayComponentProps} disableMargin={true} className="selectedDay_end selectedDay"/>
    }
    if (arrivalDay != null && departureDay != null &&
      isAfter(day, arrivalDay) && isBefore(day, departureDay)) {
      return <PickersDay {...DayComponentProps} disableMargin={true} className="selectedDay_reg selectedDay"/>
    }
    return <PickersDay {...DayComponentProps} />
  }

  //currently not needed anymore
  static range(start, end) {
    let range = []
    if (!isAfter(end, start)) {
      return range
    }

    var i = 0
    do {
      console.warn("i: " + i)
      range.push(addDays(start, i))
      i++
    } while (!isSameDay(addDays(start, i - 1), end))
    return range
  }
}