import { CrudInterface, OmitId, Table } from 'brackets-manager';
import { Database } from 'brackets-manager/dist/types';

export class InMemoryDatabase implements CrudInterface {
  protected data: Database = {
    participant: [],
    stage: [],
    group: [],
    round: [],
    match: [],
    match_game: [],
  };

  setData(data: Database): void {
    this.data = data;
  }

  makeFilter(partial: any): (entry: any) => boolean {
    return (entry: any): boolean => Object.keys(partial).every((key) => entry[key] === partial[key]);
  }

  reset(): void {
    this.data = {
      participant: [],
      stage: [],
      group: [],
      round: [],
      match: [],
      match_game: [],
    };
  }

  insert<T>(table: Table, value: OmitId<T>): Promise<number>;
  insert<T>(table: Table, values: OmitId<T>[]): Promise<boolean>;
  insert<T>(table: Table, values: OmitId<T> | OmitId<T>[]): Promise<number | boolean> {
    const tableData = this.data[table] as unknown as any[];
    let id = tableData.length;

    if (!Array.isArray(values)) {
      tableData.push({ id, ...(values as any) });
      return Promise.resolve(id);
    }

    values.forEach((value) => {
      tableData.push({ id, ...(value as any) });
      id += 1;
    });

    return Promise.resolve(true);
  }

  select<T>(table: Table): Promise<T[] | null>;
  select<T>(table: Table, id: number): Promise<T | null>;
  select<T>(table: Table, filter: Partial<T>): Promise<T[] | null>;
  select<T>(table: Table, arg?: number | Partial<T>): Promise<T[] | null> {
    const tableData = this.data[table] as unknown as any[];

    if (arg === undefined) {
      return Promise.resolve(tableData as T[]);
    }

    if (typeof arg === 'number') {
      return Promise.resolve((tableData[arg] as T) ?? null);
    }

    const filtered = tableData.filter(this.makeFilter(arg));
    return Promise.resolve((filtered as T[]) ?? null);
  }

  update<T>(table: Table, id: number, value: T): Promise<boolean>;
  update<T>(table: Table, filter: Partial<T>, value: Partial<T>): Promise<boolean>;
  update<T>(table: Table, arg: number | Partial<T>, value?: Partial<T>): Promise<boolean> {
    const tableData = this.data[table] as unknown as any[];

    if (typeof arg === 'number') {
      tableData[arg] = value as any;
      return Promise.resolve(true);
    }

    let updated = false;
    this.data[table] = tableData.map((entry) => {
      const shouldUpdate = this.makeFilter(arg)(entry);
      if (shouldUpdate) {
        updated = true;
        return { ...entry, ...(value as any) };
      }
      return entry;
    }) as any;

    return Promise.resolve(updated);
  }

  delete(table: Table): Promise<boolean>;
  delete(table: Table, id: number): Promise<boolean>;
  delete(table: Table, filter: any): Promise<number>;
  delete(table: Table, arg?: number | any): Promise<number | boolean> {
    const tableData = this.data[table] as unknown as any[];

    if (arg === undefined) {
      this.data[table] = [] as any;
      return Promise.resolve(true);
    }

    if (typeof arg === 'number') {
      if (tableData[arg]) {
        tableData.splice(arg, 1);
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    }

    const size = tableData.length;
    this.data[table] = tableData.filter((entry) => !this.makeFilter(arg)(entry)) as any;
    return Promise.resolve(size - (this.data[table] as any[]).length);
  }
}
