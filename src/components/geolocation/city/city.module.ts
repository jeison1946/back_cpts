import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { GeolocationCitySchema } from './entities/city.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Geolocation_City', schema: GeolocationCitySchema },
    ]),
  ],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
