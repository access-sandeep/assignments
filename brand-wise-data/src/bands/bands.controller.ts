import {Controller, Get} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BandsService } from './bands.service';
import { Record } from './entities/band.entity';

@ApiBearerAuth()
@ApiTags('bands')
@Controller('bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Record,
    isArray:true
  })
  async getBands(): Promise<Record[]> {
    return await this.bandsService.getBands();
  }
}
