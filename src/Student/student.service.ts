import { BadRequestException, Injectable, StreamableFile, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { Exam_Attempt } from './entities/exam_attempt.entity';
import { ExamService } from 'src/exam/exam.service';
import { Exam } from 'src/exam/entities/exam.entity';
import { CalculateFinishTime, CanTakeExam } from 'src/exam/examTime';
import { QuestionType } from 'src/question/question.entity';
import { Category } from 'src/category/category.entity';
import { ExamAttempt_Question } from 'src/exam/entities/exam-attempt-questions.entity';
import { Exam_Response } from './entities/exam_response.entity';
import { Cron } from '@nestjs/schedule';
import {execSync} from 'child_process'


@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private stdRepo: Repository<Student>,
    @InjectRepository(Exam_Attempt) private e_aRepo: Repository<Exam_Attempt>,
    private readonly examService: ExamService,
    @InjectRepository(ExamAttempt_Question)private ea_qRepo: Repository<ExamAttempt_Question>,
    @InjectRepository(Exam_Response)private erRepo: Repository<Exam_Response>,
  ) {}

  async createStudent(std: Student) {
    let s = {} as Student;
    await this.stdRepo.insert(std).then((val) => {
      s = std;
    });
    return s;
  }

  async getStudent(ID: number): Promise<Student> {
    return await this.stdRepo.query(
      `SELECT u.ID,u.Name,u.Email,s.major from user as u left join student as s ON u.ID = s.ID where s.ID = ${ID}`,
    );
  }

  async getStudents(): Promise<Student[]> {
    return await this.stdRepo.query(
      `SELECT u.ID,u.Name,u.Email,s.Major from user as u left join student as s ON u.ID = s.ID where u.ID = s.ID`,
    );
  }

  // check if student is in course
  async getStudentInCourse(cId: string, sId: number): Promise<any> {
    let isIncourse: boolean = false;
    await this.stdRepo
      .query(
        `SELECT * from student_course where C_ID = '${cId}' and S_ID = '${sId}'`,
      )
      .then((val) => {
        if (val.length !== 0) {
          isIncourse = true;
        }
      });
    return isIncourse;
  }

  // returns the exam attempt that is still ongoing if exist
  async getOnGoingAttempt(
    eId: string,
    sId: number,
  ): Promise<Exam_Attempt | any> {
    let attempt: any;
    await this.stdRepo
      .query(
        `SELECT * from exam_attempt where Student_ID = ${sId} and Exam_ID = '${eId}' and FinishTime is NULL and TimeToEnd > CURRENT_TIMESTAMP HAVING MIN(TimeToEnd)`,
      )
      .then((val) => (attempt = val[0]));
    return attempt;
  }

  //check if there is an on going exam attempt and returns boolean value
  async checkOnGoingAttempt(eId: string, sId: number) {
    let ongoingAttempt: boolean = false;
    await this.stdRepo
      .query(
        `SELECT * from exam_attempt where Student_ID = ${sId} and Exam_ID = '${eId}' and FinishTime is NULL and TimeToEnd > CURRENT_TIMESTAMP HAVING MIN(TimeToEnd)`,
      )
      .then((val) => (ongoingAttempt = val.length !== 0 ? true : false));
    return ongoingAttempt;
  }

  async createExamAttempt(
    eId: string,
    sId: number,
  ): Promise<InsertResult | UnauthorizedException | BadRequestException | any> {
    let exam: Exam = await this.examService.getExam(eId);
    let attemptID: any;
    let isInCourse: Boolean = false;
    if (exam != null) {
      // check if user is in course
      isInCourse = await this.getStudentInCourse(exam.Course_ID, sId);
      if (isInCourse) {
        if (!(await this.checkOnGoingAttempt(eId, sId))) {
          if (CanTakeExam(exam)) {
            //get no of attempts of user
            let noOfAttempts = await this.getNumberOfAttemptsOfStudent(
              eId,
              sId,
            );
            if (noOfAttempts < exam.NoOfAttempts) {
              //create Exam attempt
              let e_a = {
                Exam_ID: eId,
                Student_ID: sId,
                TimeToEnd: CalculateFinishTime(exam),
              };
              await this.e_aRepo.insert(e_a).then((val) => {
                attemptID = {identifiers: [{ID: val.identifiers[0].ID}]}
                this.prepareExamQuestionForStudent(
                  exam.QuestionBank,
                  val.identifiers[0].ID,
                );
              });
              return attemptID
            }
            throw new UnauthorizedException('Your are out of attempts');
          } else
            throw new UnauthorizedException(
              'Exam time finished or not yet started. You cannot take exam',
            );
        } else
          throw new UnauthorizedException(
            'You already have an ongoing exam attempt.',
          );
      } else {
        throw new UnauthorizedException('You are not enrolled in course');
      }
    }

    throw new BadRequestException();
  }

  //function for preparing question when exam attempt is created
  async prepareExamQuestionForStudent(qbId: string, examAttempt_ID: string) {
    let questions: any[] = [];

    let category: Category[] = [];
    await this.stdRepo
      .query(
        `Select DISTINCT c.ID,c.no_questions_to_appear_in_exam from category as c left join question as q ON c.ID=q.C_ID left join question_bank as qb ON qb.ID = q.QB_ID where q.QB_ID = '${qbId}'`,
      )
      .then((val) => {
        category = val;
      });

    for (let i = 0; i < category.length; i++) {
      await this.stdRepo
        .query(
          `select * from question as q where q.C_ID = ${category[i].ID} ORDER BY RAND() limit ${category[i].no_questions_to_appear_in_exam}`,
        )
        .then((val) => {
          let q: any[] = val;
          q.forEach((val)=>{
            questions.push({ExamAttempt_ID: examAttempt_ID,Question_ID: val.ID})
          })
          questions.sort(() => Math.random() - 0.5);
        });

    }
    return this.ea_qRepo.insert(questions)
  }

  //get number of attempts done by student
  async getNumberOfAttemptsOfStudent(eId: string, uId: number) {
    let num: number;
    await this.e_aRepo
      .query(
        `Select count(Exam_ID) from exam_attempt Where Exam_ID='${eId}' and Student_ID=${uId}`,
      )
      .then((val) => {
        num = val[0]['count(Exam_ID)'];
      });
    return num;
  }

  async deleteStudent(id: number): Promise<any> {
    return await this.stdRepo.delete(id).then(() => {
      this.stdRepo.query(`DELETE from user where ID = ${id}`);
    });
  }

  async updateStudent(id: number, s: any) {
    return await this.stdRepo.query(
      `UPDATE user LEFT JOIN student as s ON user.ID = s.ID SET user.Name='${s.Name}', s.Major='${s.Major}' WHERE user.ID = ${id}`,
    );
  }

  //adding student question response to the exam_response table
  async addQuestionResponse(q: any,eaId: string){
    
    let QuestionAvaliable; 
    let response: Exam_Response = {ExamAttempt_ID: eaId,Question_ID: q.ID, Student_Answer: q.Student_Answer,PointsEarned: q.Points,codeFilePath: q.codeFilePath}
    await this.erRepo.findOne({where:{ExamAttempt_ID: eaId, Question_ID: q.ID}}).then((val)=>{
      QuestionAvaliable = val
    })
    if(await QuestionAvaliable == null){
      return this.erRepo.insert(response)
    }
    return this.erRepo.update({ExamAttempt_ID: eaId, Question_ID: q.ID},response)
  }

  async getExamAttemptById(eaId: string, sId: number){
    return this.e_aRepo.findOne({where:{ID: eaId, Student_ID: sId}})
  }

  async submitExamAttempt(eaId: string, sId: number){
    return this.e_aRepo.update({ID: eaId, Student_ID: sId},{FinishTime: new Date()}).then(async ()=>{
      await this.GradeExamAttempt(eaId);
    })
  }

  @Cron('59 * * * * *')
  async checkForSubmit(){
    let attempts: any[];
    await this.e_aRepo.query(`Select e_a.ID, e_a.Student_ID from exam_attempt as e_a where timeToEnd < CURRENT_TIMESTAMP() and e_a.FinishTime is NULL`)
    .then((val)=>{
      attempts = val;
    })
    
    for(let i=0;i<attempts.length;i++){
      await this.submitExamAttempt(attempts[i].ID, attempts[i].Student_ID).then(async ()=>{
        await this.GradeExamAttempt(attempts[i].ID)
      })
    }
    setTimeout(() => {}, 3000);
  }

  async GradeExamAttempt(eaId: string){
    await this.e_aRepo
      .query(
        `Select DISTINCT q.ID,q.Question,q.Question_Type,e_r.Student_Answer,e_r.codeFilePath,q.Points,q.Answer,q.testFilePath,e_q.ExamAttempt_ID,q.functionName from exam_attempt as e_a left join exam_attempt_question as e_q ON e_q.ExamAttempt_ID = e_a.ID left join exam_response as e_r ON e_r.ExamAttempt_ID = e_q.ExamAttempt_ID and e_q.Question_ID = e_r.Question_ID left join question as q ON q.ID = e_q.Question_ID where e_a.ID = '${eaId}' and (e_r.Student_Answer is NOT NULL or e_r.codeFilePath is NOT NULL) and e_a.FinishTime is not null;`,
      )
      .then(async (val) => {
        for(let i=0;i<val.length;i++){
          let q: {} = {} as {};
          switch(val[i].Question_Type){
            case `${QuestionType.MCQ}`:
              q['PointsEarned'] = this.checkAnswerForMcq(val[i])
              this.erRepo.update({ExamAttempt_ID: eaId, Question_ID: val[i].ID},q)
              break
            case `${QuestionType.SHORTANSWER}`:
              q['PointsEarned'] = this.checkAnswerForShortAnswer(val[i])
              this.erRepo.update(
                { ExamAttempt_ID: eaId, Question_ID: val[i].ID },
                q,
              );
              break;
            case `${QuestionType.CODE}`:
              q['PointsEarned'] = await this.checkCodeQuestion(val[i])
              this.erRepo.update(
                { ExamAttempt_ID: eaId, Question_ID: val[i].ID },
                q,
              );
          }
        }
      })
      await this.e_aRepo.query(
        `Update exam_attempt as e_a SET e_a.Score = (Select SUM(e_r.PointsEarned) from exam_response e_r where e_r.ExamAttempt_ID = '${eaId}') where e_a.ID = '${eaId}'`,
      );
  }

  checkAnswerForShortAnswer(s){
    let answers = Object.values(JSON.parse(s.Answer))
    let isFound = answers.find((val)=> {return val.toString().toLowerCase() == s.Student_Answer.toLowerCase().replaceAll('\"','')})
    return isFound ? s.Points : 0
  }

  checkAnswerForMcq(m){
    let ans;
    let a = Object.values(JSON.parse(m.Answer))
    ans = a[0]
    if(m.Student_Answer ==  parseInt(ans)){
      return m.Points
    }
    return 0
  }

  async checkCodeQuestion(c){
    let codeFile = '../'+c.codeFilePath
    let testFile = './'+c.testFilePath
    try{
      let e = execSync(`npm test ${testFile} --filePath=${codeFile}`)
      if(e){
        return c.Points;
      }
    }
    catch{
      return 0
    }
  }

  async getCourseExamGradeListByStudent(cId: string, sId: number){
    return this.stdRepo.query(
      `Select e_a.ID, e.ID as ExamId,e.Title,e_a.Score,e_a.StartTime,e_a.FinishTime,e_a.isPublished from exam as e left join exam_attempt as e_a ON e_a.Exam_ID = e.ID where e_a.Student_ID = ${sId} and e.Course_ID = '${cId}' and e_a.isPublished=true and e_a.Score = (Select Max(ea.Score) from exam_attempt as ea where ea.Student_ID = ${sId} and ea.Exam_ID = e.ID);`,
    );
  }
  
}
