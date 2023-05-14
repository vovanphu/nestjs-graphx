import { CRUD_SERVICE_WATERMARK } from '../services';
import { ClassType, CrudQueryService } from '../types';

export function findEntityProvider<Entity, Dto>(
  providers: CrudQueryService<Entity, Dto>[],
  entity: ClassType<Entity>,
): CrudQueryService<Entity, Dto> | null {
  if (!providers || !entity) return null;
  return providers.find((p) => {
    const metadata = Reflect.getMetadata(CRUD_SERVICE_WATERMARK, p);
    return metadata?.EntityClass === entity;
  });
}
