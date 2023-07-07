import fs from 'node:fs/promises';
import { URL } from 'node:url';

const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile('db.json', JSON.stringify(this.#database));
  }

  // GET
  listTask(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          if (!value) return true;

          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  // POST
  createTask(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  // PUT
  updateTask(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      // -1 é quando não encontra
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }

  // DELETE
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      // -1 é quando não encontra
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  // PATCH
  updateTaskAsCompleted(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }
}
