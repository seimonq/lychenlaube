import {isAfter,isBefore,isSameDay} from "date-fns";

export default class Booking {

    constructor(idHash, userId, userName, userFamily, begin, end, comment) {
        this.idHash = idHash
        this.userId = userId
        this.userName = userName
        this.userFamily = userFamily
        this.begin = begin
        this.end = end
        this.comment = comment
        this.hidden = false //needed for editing a booking, that it verification does not interfere
    }
    containsDay(day) {
        return this.isInnerDay(day) || isSameDay(this.begin,day) || isSameDay(this.end,day)
    }
    isInnerDay(day) {
        return isAfter(day,this.begin) && isBefore(day,this.end)
    }
    hide() {
        this.hidden = true
    }
    show() {
        this.hidden = false
    }

    //maybe for testing here is a booking initialization
    //new Booking("idHash","x4w-wer","simon","kern",new Date(2023,3,1),new Date(2023,3,4),"lalal")
}