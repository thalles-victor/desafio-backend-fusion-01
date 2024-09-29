import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from './dtos/SignUp.dto';
import { AuthService } from './Auth.service';
import { Request } from 'express';
import { SignInDto } from './dtos/SignIn.dto';
import { JwtAuthGuard } from './Guards/JwtAuth.guard';
import { JwtPayloadType } from '@types';
import { PayloadParam } from 'src/Application/Core/Decorators/payload-param.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() singUpDto: SignUpDto, @Req() request: Request) {
    const userAgent = request.headers['user-agent'];
    const IPAdress = request.ip;

    if (!userAgent || !IPAdress) {
      throw new BadRequestException();
    }

    return this.authService.signUp(singUpDto, {
      device: userAgent,
      ip_address: IPAdress,
    });
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto, @Req() request: Request) {
    const userAgent = request.headers['user-agent'];
    const IPAdress = request.ip;

    if (!userAgent || !IPAdress) {
      throw new BadRequestException();
    }

    return this.authService.signIn(signInDto, {
      device: userAgent,
      ip_address: IPAdress,
    });
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  user(@PayloadParam() payload: JwtPayloadType) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    return this.authService.getUserInformation(payload.session_id);
  }
}
