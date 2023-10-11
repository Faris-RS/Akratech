import Dexie from 'dexie';

class MyAppDatabase extends Dexie {
  users: Dexie.Table<any, string>;

  constructor() {
    super('MyAppDatabase');
    this.version(1).stores({
      users: 'login.uuid, *picture.thumbnail, name.first, name.last',
    });
    this.users = this.table('users');
  }
}

const db = new MyAppDatabase();

export { db };