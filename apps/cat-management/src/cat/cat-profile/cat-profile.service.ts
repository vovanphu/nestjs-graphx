import { CatProfile } from '@app/entities';
import { TypeOrmCrudServiceFactory } from '@app/graphx';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CatProfileService extends TypeOrmCrudServiceFactory(CatProfile) {}
