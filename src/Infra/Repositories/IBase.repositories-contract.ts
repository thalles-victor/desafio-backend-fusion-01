export interface IBaseRepositoriesContract<Entity, UpdateEntity, UniqueParam> {
  create(entity: Entity): Promise<Entity>;
  update(updateEntity: UpdateEntity): Promise<Entity>;
  delete(param: UniqueParam): Promise<void>;
  getBy(param: UniqueParam): Promise<Entity>;
  getMany(): Promise<Entity[]>;
}
