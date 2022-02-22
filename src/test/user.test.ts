import request from 'supertest';
import bcrypt from 'bcrypt';

import { server } from '../app';
import { migrate } from '../config/migration';
import { sequelize } from '../model';
import { userFactory } from '../model/user';

jest.setTimeout(30000);


beforeAll(async () => {
  await sequelize.authenticate()
    .then(async () => {
      console.log('Database is connected successful.');
      await sequelize.drop();
      await migrate();
    })
    .catch((error: any) => {
      console.log('Connection is failed to database.\n' + error);

      expect(true).toBe(false);
    });
});

describe('Testing User', () => {
  beforeAll(async () => {
    await userFactory().create({
      email: 'test@test.com',
      password: await bcrypt.hash('test1234!', 15),
      name: '테스트',
      birth: '2000-01-01',
    })
      .catch((error) => {
        console.log(error);

        expect(true).toBe(false);
      })
  });

  describe('GET /user', () => {
    test('Without Email', async () => {
      const res = await request(server)
        .get('/user')
        .query({});

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Enter an email.');
    });

    test('With Wrong Email', async () => {
      const res = await request(server)
        .get('/user')
        .query({
          email: 'test',
        });

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Enter a correct email.');
    });

    test('With Nonexistent User', async () => {
      const res = await request(server)
        .get('/user')
        .query({
          email: 'none@test.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Cannot found that user.');
    });

    test('With Existent User', async () => {
      const res = await request(server)
        .get('/user')
        .query({
          email: 'test@test.com',
        });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('test@test.com');
      expect(res.body.name).toBe('테스트');
      expect(res.body.birth).toContain('2000-01-01');
    });
  });

  describe('POST /user', () => {
    test('Without Email', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Enter an email.');
    });

    test('With Wrong Email', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test'
        });

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Enter a correct email.');
    });

    test('With Existent Email', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test@test.com'
        });

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Email already exists.');
    });

    test('Without Name', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.name).toBe('Enter a name.');
    });

    test('With Wrong Name', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          name: '테스트테스트',
        });

      expect(res.status).toBe(400);
      expect(res.body.name).toBe('Name can be entered within 5 characters.');
    });

    test('Without Password', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          name: '테스트',
        });

      expect(res.status).toBe(400);
      expect(res.body.password).toBe('Enter a password.');
    });

    test('With Wrong Password', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          name: '테스트',
          password: 'test',
        });

      expect(res.status).toBe(400);
      expect(res.body.password).toBe('Enter a correct password.');
    });

    test('Without Birth', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          name: '테스트',
          password: 'test',
        });

      expect(res.status).toBe(400);
      expect(res.body.birth).toBe('Enter a birthday.');
    });

    test('With Wrong Birth', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          name: '테스트',
          password: 'test',
          birth: '0000-00-00',
        });

      expect(res.status).toBe(400);
      expect(res.body.birth).toBe('Enter a correct birthday.');
    });

    test('With Correct Information', async () => {
      const res = await request(server)
        .post('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          name: '테스트',
          password: 'test1234!@',
          birth: '2022-02-22'
        });

      expect(res.status).toBe(200);
    });
  });

  describe('PUT /user', () => {
    test('Without Email', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Enter an email.');
    });

    test('With Wrong Email', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test'
        });

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Enter a correct email.');
    });

    test('Without Password', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.password).toBe('Enter a password.');
    });

    test('With Wrong Password', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          password: 'test',
        });

      expect(res.status).toBe(400);
      expect(res.body.password).toBe('Password incorrect.');
    });

    test('With Correct Information Without Update', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          password: 'test1234!@',
        });

      expect(res.status).toBe(200);
    });

    test('With Wrong New Name', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          password: 'test1234!@',
          new_name: '테스트테스트',
        });

      expect(res.status).toBe(400);
      expect(res.body.new_name).toBe('Name can be entered within 5 characters.');
    });

    test('With Wrong New Password', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          password: 'test1234!@',
          new_password: 'test'
        });

      expect(res.status).toBe(400);
      expect(res.body.new_password).toBe('Enter a correct password.');
    });

    test('With Wrong New Birth', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          password: 'test1234!@',
          new_birth: '0000-00-00',
        });

      expect(res.status).toBe(400);
      expect(res.body.new_birth).toBe('Enter a correct birthday.');
    });

    test('With Correct Information', async () => {
      const res = await request(server)
        .put('/user')
        .set('Accept', 'application/json')
        .type('application/json')
        .send({
          email: 'test2@test.com',
          password: 'test1234!@',
          new_name: '테스트2',
          new_password: 'test1234!',
          new_birth: '2022-01-01'
        });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /user', () => {
    test('Without Email', async () => {
      const res = await request(server)
        .delete('/user')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Enter an email.');
    });

    test('With Wrong Email', async () => {
      const res = await request(server)
        .delete('/user')
        .send({
          email: 'test',
        });

      expect(res.status).toBe(400);
      expect(res.body.email).toBe('Enter a correct email.');
    });

    test('Without Password', async () => {
      const res = await request(server)
        .delete('/user')
        .send({
          email: 'test2@test.com',
        });

      expect(res.status).toBe(400);
      expect(res.body.password).toBe('Enter a password.');
    });

    test('With Wrong Password', async () => {
      const res = await request(server)
        .delete('/user')
        .send({
          email: 'test2@test.com',
          password: 'test',
        });

      expect(res.status).toBe(400);
      expect(res.body.password).toBe('Password incorrect.');
    });

    test('With Correct Information', async () => {
      const res = await request(server)
        .delete('/user')
        .send({
          email: 'test2@test.com',
          password: 'test1234!',
        });

      console.log(res);
      expect(res.status).toBe(200);
    });
  });
});
