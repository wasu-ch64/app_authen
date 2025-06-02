import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import path from 'path';
import { readdirSync } from 'fs';


const app: Express = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());

const routesPath = path.join(__dirname, 'routes');

async function loadRoutes() {
  for (const file of readdirSync(routesPath)) {
    if ((file.endsWith('.ts') || file.endsWith('.js')) && !file.endsWith('.d.ts') && !file.includes('test') && !file.startsWith('.')) {
      try {
        const module = await import(path.join(routesPath, file));
        const route = module.default;
        app.use('/api', route);
        // console.log(`Route loaded from file: ${file}`);
      } catch (err) {
        console.error(`Unable to load route from file: ${file}:`, err);
      }
    }
  }
}

async function startServer() {
  await loadRoutes();  // รอโหลด routes ให้เสร็จก่อน

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

  app.listen(env.PORT, () => {
    console.log(`Server is running on port: ${env.PORT} \nenvironment ${env.NODE_ENV}`);
  });
}

startServer();
