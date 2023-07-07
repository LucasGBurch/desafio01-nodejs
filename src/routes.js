import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { dateFormatter } from './utils/formatter.js';

const database = new Database();

function taskExists(id, res) {
  const [task] = database.listTask('tasks', { id });
  //console.log(task);
  if (!task) {
    return res.writeHead(404).end();
  }
}

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

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: 'title and description are required' })
          );
      }

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

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: 'title and description are required' })
          );
      }

      taskExists(id, res); // separei em função, já que é usado 3x

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

      taskExists(id, res);

      database.delete('tasks', id);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.listTask('tasks', { id });

      taskExists(id, res);

      const isTaskCompleted = !!task.completed_at;
      const completed_at = isTaskCompleted
        ? null
        : dateFormatter.format(new Date());

      database.updateTask('tasks', id, {
        completed_at,
      });

      return res.writeHead(204).end();
    },
  },
];
