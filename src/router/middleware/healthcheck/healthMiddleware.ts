import { Request, Response } from 'express';

export class HealthCheck {
  get = (req: Request, res: Response) => {
    return res.json({'status': 'OK'}).status(200).send();
  }
}
