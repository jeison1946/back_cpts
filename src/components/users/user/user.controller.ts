import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findId(@Param('id') id: string) {
    return this.userService.findId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('password-recovery')
  passwordRecovery(@Body() body: { email: string }) {
    return this.userService.passwordRecovery(body);
  }

  @Get('password-recovery')
  @ApiOperation({ summary: 'Send code to recover password' })
  @ApiResponse({
    status: 201,
    type: Response,
  })
  codeValidate(@Query() query: { code_access: number }) {
    return this.userService.codeValidate(query.code_access);
  }

  @Patch('password-recovery/:id')
  @ApiOperation({ summary: 'Send code to recover password' })
  @ApiResponse({
    status: 201,
    type: Response,
  })
  changePassqord(
    @Param() params: any,
    @Body() body: { password: string; code_access: number },
  ) {
    return this.userService.changePassqord(params.id, body);
  }
}
