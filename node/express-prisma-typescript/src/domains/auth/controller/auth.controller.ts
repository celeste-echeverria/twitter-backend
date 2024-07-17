import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { BodyValidation } from '@utils'

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


/**
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
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       required:
 *         - email
 *         - username
 *         - password
 *     LoginInputDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       required:
 *         - email
 *         - password
 */

/**
 * @swagger
 * /signup:
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
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /login:
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
 *       400:
 *         description: Invalid input data
 */