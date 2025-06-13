import { Cat } from '@app/entities';
import { TypeOrmCrudServiceFactory } from '@app/graphx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatService extends TypeOrmCrudServiceFactory(Cat) {}
