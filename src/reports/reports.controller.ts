import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminGuard } from '../guards/admin.guard';

import { ReportsService } from './reports.service';

import { AuthGard } from '../guards/auth.guard';

import { CurrentUser } from '../users/decorators/current-user.decorator';

import { Report } from './report.entity';
import { User } from '../users/user.entity';

import { Serialize } from '../interceptors/serialize.interceptor';

import { ReportDto } from './dtos/report.dto';
import { ApprovedReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { query } from 'express';
import { GetEstimateDto } from './dtos/get-estimates.dto';

@Controller('v1/reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.createReport(body, user);
  }

  // @Get()
  // getListReports() {
  //   return this.reportsService.getReports();
  // }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.generateEstimate(query);
  }
}
