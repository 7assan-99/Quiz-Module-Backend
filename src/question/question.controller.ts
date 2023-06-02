import { Controller,UseGuards,Post, Put, Delete, Get, Body, Param, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, StreamableFile, Header } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AuthGuard } from 'src/auth/Guard/auth.guard';
import { RolesGuard } from 'src/auth/Role/roles.guard';
import { Roles } from 'src/auth/Role/roles.decorator';
import { Role } from 'src/auth/Role/role.enum';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { Question } from './question.entity';
import { GetId } from 'src/auth/GetId/getId.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { editFileName, jsFileFilter } from 'src/file-upload-helper/file-helper';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('question')
export class QuestionController {
  constructor(private readonly qService: QuestionService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Post('/create')
  create(@Body() q: Question, @GetId() id: number): Promise<InsertResult> {
    return this.qService.create(q, id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('/getQuestionsByAttempt/:id')
  getQuestionExamsByExamAttempt(
    @Param('id') eaId: string,
    @GetId() sId: number,
  ) {
    return this.qService.getQuestionsByExamAttempt(eaId, sId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('/getQuestionsByExam/:id')
  getQuestionsByExam(@Param('id') eId: string) {
    return this.qService.getQuestionsByExam(eId);
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor,Role.Student)
  @Get('getCodeFile/:folder/:file')
  getFile(@Param('folder') folder, @Param('file')fl): StreamableFile {
    const file = createReadStream(join(process.cwd(),'src/uploadedfiles',folder,fl));
    const f = new StreamableFile(file);
    return f;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Get('/:id')
  get(@Param('id') id: string): Promise<Question> {
    return this.qService.get(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Delete('/delete/:id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.qService.delete(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Put('/update')
  Update(@Body() q: Question, @GetId() id: number): Promise<UpdateResult> {
    return this.qService.update(q, id);
  }

  //save the test case file created by instructor
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Instructor)
  @Post('upload_file/testCase')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: jsFileFilter,
      storage: diskStorage({
        destination: 'src/uploadedfiles/test-cases',
        filename: editFileName,
      }),
    }),
  )
  saveFile(@UploadedFile() file: Express.Multer.File) {
    const response = {
      url: `test-cases/${file.filename}`,
    };
    return response;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('upload_file/code_attempt')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: jsFileFilter,
      storage: diskStorage({
        destination: 'src/uploadedfiles/user-code-file',
        filename: editFileName,
      }),
    }),
  )
  saveCodeAttemptFile(@UploadedFile() file: Express.Multer.File) {
    const response = {
      url: `user-code-file/${file.filename}`,
    };
    return response;
  }
}
