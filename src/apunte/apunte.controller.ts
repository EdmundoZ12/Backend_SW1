import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApunteService } from './apunte.service';
import { CreateApunteDto } from './dto/create-apunte.dto';
import { UpdateApunteDto } from './dto/update-apunte.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Apunte') 
@Controller('apunte')
export class ApunteController {
  constructor(private readonly apunteService: ApunteService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.apunteService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.apunteService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createApunteDto: CreateApunteDto) {
    return this.apunteService.create(createApunteDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApunteDto: UpdateApunteDto) {
    return this.apunteService.update(+id, updateApunteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.apunteService.remove(+id);
  }
}
