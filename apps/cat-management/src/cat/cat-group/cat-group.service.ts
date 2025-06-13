import { CatGroup } from '@app/entities';
import { TypeOrmCrudServiceFactory } from '@app/graphx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatGroupService extends TypeOrmCrudServiceFactory(CatGroup) {}
