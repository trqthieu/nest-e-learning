import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import configuration from './configs/configuration';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { SeedsModule } from './seeds/seed.module';
import { MailModule } from './mail/mail.module';
import { CoursesModule } from './courses/courses.module';
import { CourseGroupModule } from './course-group/course-group.module';
import { CourseUnitsModule } from './course-units/course-units.module';
import { CourseSectionsModule } from './course-sections/course-sections.module';
import { LessonsModule } from './lessons/lessons.module';
import { ExercisesModule } from './exercises/exercises.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionSelectsModule } from './question-selects/question-selects.module';
import { CourseReviewsModule } from './course-reviews/course-reviews.module';
import { ExamReviewsModule } from './exam-reviews/exam-reviews.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { AnswerAnalyzesModule } from './answer-analyzes/answer-analyzes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FlashcardsModule } from './flashcards/flashcards.module';
import { FlashcardGroupsModule } from './flashcard-groups/flashcard-groups.module';
import { FlashcardItemsModule } from './flashcard-items/flashcard-items.module';
import { UserCourseModule } from './user-course/user-course.module';
import { UserCourseUnitModule } from './user-course-unit/user-course-unit.module';
import { UserLessonModule } from './user-lesson/user-lesson.module';
import { UserExamModule } from './user-exam/user-exam.module';
import { UserExerciseModule } from './user-exercise/user-exercise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        password: configService.get<string>('DATABASE_PASSWORD', '1'),
        username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
        entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
        database: configService.get<string>('DATABASE_NAME', 'e-learning'),
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', true),
        logging: configService.get<boolean>('DATABASE_LOGGING', true),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    FilesModule,
    CloudinaryModule,
    SeedsModule,
    MailModule,
    CoursesModule,
    CourseGroupModule,
    CourseUnitsModule,
    CourseSectionsModule,
    LessonsModule,
    ExercisesModule,
    QuestionsModule,
    QuestionSelectsModule,
    CourseReviewsModule,
    ExamReviewsModule,
    ArticlesModule,
    CommentsModule,
    AnswerAnalyzesModule,
    NotificationsModule,
    FlashcardsModule,
    FlashcardGroupsModule,
    FlashcardItemsModule,
    UserCourseModule,
    UserCourseUnitModule,
    UserLessonModule,
    UserExamModule,
    UserExerciseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
