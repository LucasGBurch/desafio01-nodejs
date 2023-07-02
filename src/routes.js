import { Database } from './database';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path';
import { dateFormatter } from './utils/formatter';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const users = database.listTask(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: dateFormatter.format(new Date()),
        updated_at: dateFormatter.format(new Date()),
      }
    }
  }
];
