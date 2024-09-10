import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { BodyValidation, withAuth } from '@utils'

import { AuthService, AuthServiceImpl } from '../service'
import { LoginInputDTO, SignupInputDTO } from '../dto'

export const authRouter = Router()

// Use dependency injection
const service: AuthService = new AuthServiceImpl()

authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  const data = req.body
  const token = await service.signup(data)
  return res.status(HttpStatus.CREATED).json(token)
})

authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  const data = req.body
  const token = await service.login(data)
  return res.status(HttpStatus.OK).json(token)
})

authRouter.get('/verify', withAuth, async (req: Request, res: Response) => {
  const {userId} = res.locals.context
  console.log('verified with ', userId)
  return res.status(HttpStatus.OK).json()
})

/**p
 * @swagger
 * components:
 *   schemas:
 *     SignupInputDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         name:
 *           type: string
 *           description: User's full name
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           description: User's password
 *         privacy:
 *           type: boolean
 *           description: True if account is private
 *       required:
 *         - email
 *         - name
 *         - username
 *         - password
 *         - privacy
 * 
 *     LoginInputDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email (optional)
 *         username:
 *           type: string
 *           description: User's username (optional)
 *         password:
 *           type: string
 *           description: User's password
 *       required:
 *         - password
 * 
 */


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInputDTO'
 *     responses:
 *       201:
 *         description: The user was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error at 'signup'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInputDTO'
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid credentials
 *       500:
 *         description: Internal server error at 'login'
 */