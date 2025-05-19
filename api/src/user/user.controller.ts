import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDto } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
import { AuthJWTSwaggerDoc } from './decorators/auth-swagger.decorator';
import { RegisterByAdminDto } from './dto/register-by-admin.dto';
import { RegisterDto } from './dto/register-user.dto';
import { AdminJwtAuthGuard } from './guards/admin-jwt.guard';
import { RegisterFirstAdminDto } from './dto/register-first-admin.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register/admin')
  @UseGuards(AdminJwtAuthGuard)
  @AuthJWTSwaggerDoc()
  @ApiBody({ type: RegisterByAdminDto })
  async registerAdmin(
    @Body()
    body: RegisterByAdminDto,
  ) {
    await this.userService.register(body);
    return {
      msg: 'Created User',
    };
  }

  @Post('/register/first/admin')
  @AuthJWTSwaggerDoc()
  @ApiBody({ type: RegisterFirstAdminDto })
  async registerFirstAdmin(
    @Body()
    body: RegisterFirstAdminDto,
  ) {
    await this.userService.registerFirstAdmin(body);
    return {
      msg: 'Created First admin',
    };
  }

  @Post('register/common')
  @ApiBody({ type: RegisterDto })
  async registerUser(
    @Body()
    body: RegisterDto,
  ) {
    return await this.userService.registerCommonUser(body);
  }

  @Post('login')
  @ApiBody({ type: SignInDto })
  login(@Body() body: SignInDto) {
    return this.userService.login(body.email, body.password);
  }
}
