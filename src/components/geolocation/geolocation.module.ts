import { Module } from '@nestjs/common';
import { CityModule } from './city/city.module';

@Module({
  imports: [CityModule],
})
export class GeolocationModule {}
