import { Course } from "src/course/course.entity";
import { Exam } from "./entities/exam.entity";
import * as moment from 'moment';

// calculate time for ending the exam attempt
export const CalculateFinishTime = (e: Exam) => {
    let enTime = new Date(e.TimeToEnd).toISOString().toLocaleString().replace(',', '')
    let timeToFinish: Date;
    let endTime = moment(enTime);
    let now = moment();
    now.format('YYYY-MM-DD HH:mm:ss');
    console.log(endTime.diff(now,'m'))
    if(endTime.diff(now,'m') >= e.TimeToAttempt){
        console.log(endTime.diff(now, 'm') >= e.TimeToAttempt);
        now.add(e.TimeToAttempt,'m')
        timeToFinish = new Date(now.toISOString())
    }
    else{
        now.add(endTime.diff(now,'m',true),'m');
        timeToFinish = new Date(now.toISOString());
    }
    console.log(timeToFinish)
    return timeToFinish
};

// calculate time to decide if student can take exam if it is in the time range set by instructor
export const CanTakeExam = (e: Exam) =>{

    
    let enTime = new Date(e.TimeToEnd).toISOString().toLocaleString().replace(',', '')

    let endTime = moment(enTime, 'YYYY MM DD hh:mm:ss');
    endTime.add(3, 'h')

    let stTime = new Date(e.TimeToStart)
      .toISOString()
      .toLocaleString()
      .replace(',', '')

    let startTime = moment(stTime, 'YYYY MM DD hh:mm:ss');
    startTime.add(3,'h')

    let now = moment();
    now.format('YYYY-MM-DD hh:mm:ss');
    
    if(now.diff(startTime) >= 0 && now.diff(endTime) <= 0){
        return true
    }
    return false
}
