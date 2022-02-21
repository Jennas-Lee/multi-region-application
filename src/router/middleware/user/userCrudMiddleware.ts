import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import { userFactory } from '../../../model/user';

const userModel = userFactory();

export class UserCrud {
  get = async (req: Request, res: Response) => {
    const email: string = req.query['email'] as string || '';
    let resultMessage: { [k: string]: any } = {};
    let resultStatus: number = 0;

    if (email === '') {
      resultMessage['error'] = 'Enter an email.';
      resultStatus = 400;
    } else if (!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.exec(email)) {
      resultMessage['error'] = 'Enter a correct email.';
      resultStatus = 400;
    } else {
      const user = await userModel.findOne({ where: { email: email } });

      if (!user) {
        resultMessage['error'] = 'Cannot fount that user.';
        resultStatus = 400;
      } else {
        resultMessage['email'] = user.email;
        resultMessage['name'] = user.name;
        resultMessage['birth'] = user.birth;
        resultStatus = 200;
      }
    }

    return res.status(resultStatus).json(resultMessage).send();
  }

  post = async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email || '';
    const name: string = req.body.name || '';
    const password: string = req.body.password || '';
    const birth: string = req.body.birth || '';
    let resultMessage: { [k: string]: any } = {};
    let resultStatus: number = 0;

    if (email === '') {
      resultMessage['email'] = 'Enter an email.';
      resultStatus = 400;
    } else if (!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.exec(email)) {
      resultMessage['email'] = 'Enter a correct email.';
      resultStatus = 400;
    } else if (await userModel.count({ where: { email: email } }) >= 1) {
      resultMessage['email'] = 'Email already exists.';
      resultStatus = 400;
    } else {
      resultMessage['email'] = false;
    }

    if (name === '') {
      resultMessage['name'] = 'Enter a name.';
      resultStatus = 400;
    } else if (name.length > 6) {
      resultMessage['name'] = 'Name can be entered within 5 characters.';
      resultStatus = 400;
    } else {
      resultMessage['name'] = false;
    }

    if (password === '') {
      resultMessage['password'] = 'Enter a password.';
      resultStatus = 400;
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,20}$/.exec(password)) {
      resultMessage['password'] = 'Enter a correct password.';
      resultStatus = 400;
    } else {
      resultMessage['password'] = false;
    }

    if (birth === '') {
      resultMessage['birth'] = 'Enter a birthday.';
      resultStatus = 400;
    } else if (!/[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.exec(birth)) {
      resultMessage['birth'] = 'Enter a correct birthday.';
      resultStatus = 400;
    } else {
      resultMessage['birth'] = false;
    }

    if (resultStatus === 0) {
      await userModel.create({
        email: email,
        name: name,
        password: bcrypt.hashSync(password, 15),
        birth: birth
      })
        .then(() => {
          resultStatus = 200;
        })
        .catch((error) => {
          next(error);
        });
    }

    return res.status(resultStatus).json(resultMessage).send();
  }

  put = (req: Request, res: Response) => {
    return res.status(200).json({ 'status': 'OK' }).send();
  }

  delete = (req: Request, res: Response) => {
    return res.status(200).json({ 'status': 'OK' }).send();
  }
}
