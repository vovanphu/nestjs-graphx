import { TypeOrmCrudService } from '@app/crud';
import { UserDto, UserEntity } from '@app/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserManagementService extends TypeOrmCrudService<
  UserEntity,
  UserDto
> {
  constructor(@InjectRepository(UserEntity) repo: Repository<UserEntity>) {
    super(repo);
  }
}
