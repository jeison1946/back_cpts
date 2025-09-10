import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { MailService } from 'src/core/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly model: Model<User>,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newPost = new this.model(createUserDto);
    return await newPost.save();
  }

  async findAll(query) {
    const { limit, page } = query;
    const filters = this.buildFilters(query);
    const skip = (page - 1) * limit;
    const count = await this.model.countDocuments(filters);
    const data = await this.model
      .find(filters, { password: 0, code_access: 0 })
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

  async findOne(query) {
    const filters = this.buildFilters(query);
    return await this.model.findOne(filters).lean();
  }

  async findId(id: string) {
    return await this.model
      .findById(id, {
        password: 0,
      })
      .lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.model.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  buildFilters(query) {
    const { name, email, role, status } = query || {};
    const filters: any = {};
    if (name) filters.name = { $regex: `^${name}`, $options: 'i' };
    if (email) filters.email = { $regex: `^${email}`, $options: 'i' };
    if (role) filters.role = role;
    if (status) filters.status = status;
    return filters;
  }

  async passwordRecovery(data: { email: string }) {
    const user = await this.model.findOne(data).lean();
    if (!user) throw new BadRequestException('Usuario no encontrado');

    if (user.status == 'locked')
      throw new BadRequestException('Acceso denegado');

    const newCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    await this.model.updateOne(data, {
      status: 'disabled',
      code_access: newCode,
    });

    this.mailService.send({
      email: user.email,
      subject: 'Restablecer contraseña | Hekaentrega',
      template_id: 'codeRecoveryUser',
      context: {
        code: newCode,
      },
    });

    return {
      message: `Se ha enviado un código de cambio de contraseña a ${user.email}`,
      _id: user._id,
    };
  }

  async codeValidate(code_access: number) {
    const user = await this.model.findOne({ code_access: code_access }).lean();
    if (user) {
      return {
        message: 'Codigo confirmado',
      };
    }
    throw new BadRequestException('Código de validación invalido.');
  }

  async changePassqord(
    id: string,
    data: { password: string; code_access: number },
  ) {
    const user = await this.model.findById(id).lean();
    if (!user) throw new BadRequestException('Acceso denegado.');
    if (user.code_access == data.code_access) {
      const dataContent: any = {
        password: await bcrypt.hash(data.password, 10),
        status: 'enabled',
        code_access: null,
      };
      await this.model.findByIdAndUpdate(id, {
        password: await bcrypt.hash(data.password, 10),
        status: 'enabled',
        code_access: null,
      });

      return {
        message:
          'Su cambio de contraseña ha sido exitoso, por favor inicie sessión.',
      };
    } else {
      throw new BadRequestException('Código de validación invalido.');
    }
  }
}
