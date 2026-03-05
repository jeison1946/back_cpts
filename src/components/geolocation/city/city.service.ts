import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeolocationCity } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectModel('Geolocation_City')
    private readonly model: Model<GeolocationCity>,
  ) {}
  create(createCityDto: CreateCityDto) {
    return 'This action adds a new city';
  }

  async findAll(query) {
    const { text, dane, limit = 13, page = 1 } = query || {};
    const filters: any = {};
    if (text) {
      filters.$or = [
        { label: { $regex: query.text, $options: 'i' } },
        { 'state.label': { $regex: query.text, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const count = await this.model.countDocuments(filters);
    const data = await this.model
      .find(filters)
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return {
      rows: data,
      pager: {
        total: count,
        pages: Math.ceil(count / limit),
        page: parseInt(page),
        nextPage: parseInt(page) + 1,
        previusPage: parseInt(page) - 1,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
