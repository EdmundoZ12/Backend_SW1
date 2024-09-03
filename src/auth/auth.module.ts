import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants/jwt.constant';



@Module({
    imports:[
        UsuarioModule,
        JwtModule.register({
            global:true,
            secret:jwtConstants.secret,
            signOptions:{expiresIn:'1d'}
        })
    ],
    controllers:[AuthController],
    providers:[AuthService],
})
export class AuthModule {
}
