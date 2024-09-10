import { Injectable } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository:Repository<Usuario>,
  ){}

  async register(createUsuarioDto: CreateUsuarioDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password,salt);

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password:hashedPassword,
    })

    return this.usuarioRepository.save(usuario);
  }

  findAll():Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  findOne(id: number):Promise<Usuario> {
    return this.usuarioRepository.findOneBy({id:id});
  }

  async getUsuariobyEmail(email:string){
    return await this.usuarioRepository.findOneBy({email});
}

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) : Promise<Usuario>{
    await this.usuarioRepository.update(id,updateUsuarioDto) ;
    return this.findOne(id);
  }

  async remove(id: number):Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}
