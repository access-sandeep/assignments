import { Module } from '@nestjs/common';
import { BandsModule } from './bands/bands.module';

@Module({
  imports: [BandsModule],
})
export class AppModule {}
