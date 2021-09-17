import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimates.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}

  createReport(body: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(body);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  getReports() {
    return this.reportsRepository.find();
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepository.findOne(id);

    if (!report) {
      throw new NotFoundException(`Report not found `);
    }

    report.approved = approved;
    this.reportsRepository.save(report);
  }

  async generateEstimate({
    manufacturer,
    model,
    lon,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    const result = await this.reportsRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('manufacturer = :manufacturer', {
        manufacturer: manufacturer,
      })
      .andWhere('model= :model', { model: model })
      .andWhere('lon - :lon BETWEEN -5 AND 5', { lon })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3 ', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .groupBy('mileage')
      .limit(3)
      .getRawOne();

    if (!result) {
      throw new BadRequestException(`Price Unknown!`);
    }
    return result;
  }
}
