import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { dateFormatter } from './utils/formatter.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.listTask(
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
      };

      database.createTask('tasks', task);

      return res.writeHead(201).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      database.updateTask('tasks', id, {
        title,
        description,
        updated_at: dateFormatter.format(new Date()),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete('users', id);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      //const [task] = database.listTask('tasks', { id });
      
      database.updateTaskAsCompleted('tasks', id, {
          completed_at: completed_at ? dateFormatter.format(new Date()) : null,
          })

      return res.writeHead(204).end();
    },
  },
];
