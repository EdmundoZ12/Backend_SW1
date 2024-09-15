import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guard/auth.guard";
import { LoginUsuarioDto } from "./dto/login-usuario.dto";


@Controller('auth')
export class AuthController{
    constructor(
        private readonly authservice:AuthService,
    ){}

    @Post('login')
    login (@Body() loginUsuarioDto:LoginUsuarioDto){
        return this.authservice.login(loginUsuarioDto);
    }

    @UseGuards( AuthGuard )
    @Get('check-token')
    checkToken( @Request() req: Request ) {
        const user = req['user'];
        return this.authservice.checkToken(user);
    }
}