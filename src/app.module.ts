import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: '1',
      username: 'postgres',
      entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
      database: 'e-learning',
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    FilesModule,
    CloudinaryModule,
    SeedsModule,
    MailModule,
    CoursesModule,
    CourseGroupModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
