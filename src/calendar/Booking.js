import {isAfter,isBefore,isSameDay} from "date-fns";

export default class Booking {
    constructor(begin,end,name,comment) {
        this.begin = begin
        this.end = end
        this.name = name
        this.comment = comment
    }
    containsDay(day) {
        return this.isInnerDay(day) || isSameDay(this.begin,day) || isSameDay(this.end,day)
    }
    isInnerDay(day) {
        return isAfter(day,this.begin) && isBefore(day,this.end)
    }
}