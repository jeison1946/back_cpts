import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './components/users/user/user.module';
import { TokenModule } from './components/users/token/token.module';
import { CoreModule } from './core/core.module';
import { CityModule } from './components/geolocation/city/city.module';
import { GeolocationModule } from './components/geolocation/geolocation.module';
import { UsersModule } from './components/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CoreModule,
    GeolocationModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
