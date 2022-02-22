import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import { User, userFactory } from '../../../model/user';

const userModel = userFactory();

export class UserCrud {
  get = async (req: Request, res: Response) => {
    const email: string = req.query['email'] as string || '';
    let resultMessage: { [k: string]: any } = {};
    let resultStatus: number = 0;

    if (email === '') {
      resultMessage['email'] = 'Enter an email.';
      resultStatus = 400;
    } else if (!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.exec(email)) {
      resultMessage['email'] = 'Enter a correct email.';
      resultStatus = 400;
    } else {
      const user: User | null = await userModel.findOne({ where: { email: email } });

      if (!user) {
        resultMessage['email'] = 'Cannot found that user.';
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
    } else if (await userModel.count({ where: { email: email }, paranoid: false }) >= 1) {
      resultMessage['email'] = 'Email already exists.';
      resultStatus = 400;
    } else {
      resultMessage['email'] = false;
    }

    if (name === '') {
      resultMessage['name'] = 'Enter a name.';
      resultStatus = 400;
    } else if (name.length > 5) {
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
          error.status = 500;
          next(error);
        });
    }

    return res.status(resultStatus).json(resultMessage).send();
  }

  put = async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email || '';
    const password: string = req.body.password || '';
    const new_password: string = req.body.new_password || '';
    const new_name: string = req.body.new_name || '';
    const new_birth: string = req.body.new_birth || '';
    let resultMessage: { [k: string]: any } = {};
    let resultStatus: number = 0;

    if (email === '') {
      resultMessage['email'] = 'Enter an email.';
      resultStatus = 400;
    } else if (!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.exec(email)) {
      resultMessage['email'] = 'Enter a correct email.';
      resultStatus = 400;
    } else {
      resultMessage['email'] = false;
    }

    if (password === '') {
      resultMessage['password'] = 'Enter a password.';
      resultStatus = 400;
    } else {
      resultMessage['password'] = false;
    }

    if (new_name !== '' && new_name.length > 5) {
      resultMessage['new_name'] = 'Name can be entered within 5 characters.';
      resultStatus = 400;
    } else {
      resultMessage['new_name'] = false;
    }

    if (new_password !== '' && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,20}$/.exec(new_password)) {
      resultMessage['new_password'] = 'Enter a correct password.';
      resultStatus = 400;
    } else {
      resultMessage['new_password'] = false;
    }

    if (new_birth !== '' && !/[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.exec(new_birth)) {
      resultMessage['new_birth'] = 'Enter a correct birthday.';
      resultStatus = 400;
    } else {
      resultMessage['new_birth'] = false;
    }

    if (resultStatus !== 400) {
      let user: User | null = await userModel.findOne({ where: { email: email } });

      if (!user) {
        resultMessage['email'] = 'Cannot fount that user.';
        resultStatus = 400;
      } else if (!bcrypt.compareSync(password, user.password)) {
        resultMessage['password'] = 'Password incorrect.';
        resultStatus = 400;
      } else {
        let user_attr: object = {
          'name': new_name !== '' ? new_name : user.name,
          'password': new_password !== '' ? bcrypt.hashSync(new_password, 15) : user.password,
          'birth': new_birth !== '' ? new_birth : user.birth,
        }

        await user.update(user_attr)
          .then(() => {
            resultStatus = 200;
          })
          .catch((error) => {
            error.status = 500;
            next(error);
          });
      }
    }

    return res.status(resultStatus).json(resultMessage).send();
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const email: string = req.body.email || '';
    const password: string = req.body.password || '';
    let resultMessage: { [k: string]: any } = {};
    let resultStatus: number = 0;

    if (email === '') {
      resultMessage['email'] = 'Enter an email.';
      resultStatus = 400;
    } else if (!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.exec(email)) {
      resultMessage['email'] = 'Enter a correct email.';
      resultStatus = 400;
    } else {
      resultMessage['email'] = false;
    }

    if (password === '') {
      resultMessage['password'] = 'Enter a password.';
      resultStatus = 400;
    } else {
      resultMessage['password'] = false;
    }

    if (resultStatus !== 400) {
      let user: User | null = await userModel.findOne({ where: { email: email } });

      if (!user) {
        resultMessage['email'] = 'Cannot fount that user.';
        resultStatus = 400;
      } else if (!bcrypt.compareSync(password, user.password)) {
        resultMessage['password'] = 'Password incorrect.';
        resultStatus = 400;
      } else {
        await user.destroy()
          .then(() => {
            resultStatus = 200;
          })
          .catch((error) => {
            error.status = 500;
            next(error);
          });
      }
    }

    return res.status(resultStatus).json(resultMessage).send();
  }
}
