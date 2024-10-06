import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsuarioService } from "src/usuario/usuario.service";
import * as bcrypt from 'bcrypt';
import { LoginUsuarioDto } from "./dto/login-usuario.dto";



@Injectable()
export class AuthService{
    constructor(
        private readonly usuarioService : UsuarioService,
        private readonly jwtService : JwtService,
    ){}

  async login({ email, password }: LoginUsuarioDto) {
    try {
      const usuario = await this.usuarioService.getUsuariobyEmail(email);
      if (!usuario) {
        throw new UnauthorizedException('email is wrong');
      }
      const ispasswordValid = await bcrypt.compare(password, usuario.password);
      if (!ispasswordValid) {
        throw new UnauthorizedException('email is wrong');
      }
      const payload = { email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido };
      const token = await this.jwtService.signAsync(payload);
      return {
        payload,
        token
      };
    } catch (e) {
      throw new HttpException('failed to retrive Users', HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  checkToken( usuario ) {
    const payload = { email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido };
    const token = this.jwtService.sign(payload);
    return {
      payload,
      token
    }
  }
}