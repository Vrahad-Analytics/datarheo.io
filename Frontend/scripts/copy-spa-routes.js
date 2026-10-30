import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDirectory = resolve('dist');
const indexFile = resolve(distDirectory, 'index.html');
const routes = ['login', 'register', 'reset-password'];

await Promise.all(routes.map(async (route) => {
  const routeDirectory = resolve(distDirectory, route);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(indexFile, resolve(routeDirectory, 'index.html'));
}));
