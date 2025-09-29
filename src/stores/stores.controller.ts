import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorators';
import { UserRole } from '../common/roles';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Get()
  findAll(@Query('name') name?: string, @Query('address') address?: string) {
    return this.storesService.findAll({ name, address });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storesService.remove(id);
  }
}
