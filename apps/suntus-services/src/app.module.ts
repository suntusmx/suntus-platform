import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { GraphQLConfigModule } from './graphql/graphql.module';
import { UsersModule } from './users/users.module';
import { AuditModule } from './audit/audit.module';
import { TermsModule } from './terms/terms.module';
import { StorageModule } from './storage/storage.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AuditInterceptor } from './audit/common/interceptors/audit.interceptor';
import { TermsAcceptanceGuard } from './terms/common/guards/terms-acceptance.guard';
import { I18nModule } from './common/i18n/i18n.module';
import { I18nMiddleware } from './common/i18n/i18n.middleware';
import { AuthModule } from './auth/auth.module';
import { ClientProfileModule } from './client-profile/client-profile.module';
import { LocationsModule } from './locations/locations.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    GraphQLConfigModule,
    I18nModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    UsersModule,
    ClientProfileModule,
    LocationsModule,
    AuditModule,
    TermsModule,
    StorageModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: TermsAcceptanceGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, I18nMiddleware)
      .forRoutes('*');
  }
}
