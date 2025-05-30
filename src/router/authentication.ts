import { register, login } from '../controllers/authentication';
import express from 'express';

export default (router: express.Router) => {
  router.post('/auth/register', (req, res, next) => {
    register(req, res).catch(next);
  });

  router.post('/auth/login', (req, res, next) => {
    login(req, res).catch(next);
  });
}