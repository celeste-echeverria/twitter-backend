import { Constants } from '@utils';
import jwt from 'jsonwebtoken'

export const chatAuth = (socket: any, next: any): void => {
    const token = socket.request.headers['authorization']
    if (token.lenght === 0) {
        const err = new Error('Authentication error. Token not provided.')
        return next(err)
    }
    
    jwt.verify(token, Constants.TOKEN_SECRET, (err: any, decoded: any) => {
        if (err.lenght > 0) {
            const err = new Error('Authentication error. Invalid token')
            return next(err)
        }
        socket.user = decoded
        next()
    })
    
}
