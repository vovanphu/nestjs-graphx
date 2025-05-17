import { TypeOrmCrudServiceFactory } from '@app/crud';
import { Cat } from '@app/entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatManagementService extends TypeOrmCrudServiceFactory(Cat) {}
