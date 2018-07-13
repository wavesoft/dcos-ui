import { BaseStore } from "./BaseStore";

export class GetSetBaseStore extends BaseStore {
  get(key: string): any;
  set(data: any): void;
}
