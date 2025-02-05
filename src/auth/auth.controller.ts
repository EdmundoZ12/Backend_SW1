import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('login')
  login(@Body() loginUsuarioDto: LoginUsuarioDto) {
    console.log(loginUsuarioDto.email);
    return this.authservice.login(loginUsuarioDto);
  }

    @UseGuards( AuthGuard )
    @Get('check-token')
    checkToken( @Request() req: Request ) {
        const user = req['user'];
        return this.authservice.checkToken(user);
    }

    @UseGuards( AuthGuard )
    @Get('check-email')
    checkEmailByToken( @Request() req: Request ) {
        const user = req['user'];
        return this.authservice.checkEmailByToken(user);
    }


  @Post('update-token')
  async updateTokenDevice(
    @Body() data: { email: string; tokenDevice: string | null },
  ) {
    return this.authservice.updateTokenDevice(data.email, data.tokenDevice);
  }
}
