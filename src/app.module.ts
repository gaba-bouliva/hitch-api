import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
const dbConfig = require('../ormconfig.js');

console.log('Database Config Settings:', dbConfig);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRoot(dbConfig),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'postgres',
    //       database: config.get<string>('DB_NAME'),
    //       port: config.get('DB_PORT'),
    //       host: config.get<string>('DB_HOST'),
    //       username: config.get<string>('DB_USERNAME'),
    //       password: config.get<string>('DB_PASSWORD'),
    //       entities: [User, Report],
    //       synchronize: true,
    //     };
    //   },
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   database: process.env.NODE_ENV === 'test' ? 'hitch-test-db' : 'hitch',
    //   username: 'postgres',
    //   password: 'postgres',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
