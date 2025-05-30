import { Request, Response, NextFunction } from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../store/services/user';

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: resourceId } = req.params; // ID do recurso que se quer acessar/modificar
    const currentUserId = get(req, 'identity._id') as string; // ID do usuário logado

    console.log('isOwner: Resource ID from params:', resourceId); // Log para debug
    console.log('isOwner: Current user ID from identity:', currentUserId); // Log para debug

    if (!currentUserId) {
      // Isso pode acontecer se 'isAuthenticated' falhar em adicionar 'identity' ou se o _id não existir.
      console.log('isOwner: User ID not found in request identity.'); // Log para debug
      // CORREÇÃO AQUI:
      res.status(403).json({ error: 'Authorization failed: User identity not found in request. Ensure you are authenticated.' });
      return;
    }

    // Certifique-se de que ambos são strings para comparação, se necessário.
    // Se req.identity._id for um ObjectId do Mongoose, por exemplo, get(req, 'identity._id').toString() pode ser mais seguro.
    // Mas como você já fez `as string`, a comparação direta deve funcionar se ambos forem strings.
    if (currentUserId.toString() !== resourceId) {
      console.log('isOwner: User is not the owner. Current User ID:', currentUserId, 'Resource ID:', resourceId); // Log para debug
      // CORREÇÃO AQUI:
      res.status(403).json({ error: 'Authorization failed: You are not the owner of this resource.' });
      return;
    }

    console.log('isOwner: User is owner. Access granted.'); // Log para debug
    next();

  } catch (error) {
    console.log('isOwner Error:', error);
    // CORREÇÃO AQUI (ou mantenha sendStatus):
    res.status(400).json({ error: 'Bad request during ownership check.' });
    // Ou: res.sendStatus(400);
    return; // Adicionado para consistência
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies['basic-auth'];
    if (!sessionToken) {
      console.log('isAuthenticated: No session token found in cookies.'); // Log para debug
      // CORREÇÃO AQUI:
      res.status(403).json({ error: 'Authentication failed: No session token provided.' });
      return;
    }

    console.log('isAuthenticated: Session token found:', sessionToken); // Log para debug
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      console.log('isAuthenticated: No user found for session token.'); // Log para debug
      // CORREÇÃO AQUI:
      res.status(403).json({ error: 'Authentication failed: Invalid session token.' });
      return;
    }

    console.log('isAuthenticated: User authenticated:', existingUser._id); // Log para debug
    merge(req, { identity: existingUser });
    next();

  } catch (error) {
    console.log('isAuthenticated Error:', error);
    // CORREÇÃO AQUI (ou mantenha sendStatus se não quiser JSON no erro 400 genérico):
    res.status(400).json({ error: 'Bad request during authentication.' });
    // Ou: res.sendStatus(400); (se não precisar de corpo JSON aqui)
    return; // Adicionado para consistência
  }
};