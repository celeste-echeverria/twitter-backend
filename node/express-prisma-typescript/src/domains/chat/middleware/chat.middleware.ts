import { Constants } from '@utils';
import jwt from 'jsonwebtoken'

export const chatAuth = (socket: any, next: any): void => {
    const token = socket.handshake.headers['authorization']
    
    if (!token) {
        const err = new Error('Authentication error. Token not provided.')
        return next(err)
    }
    
    jwt.verify(token, Constants.TOKEN_SECRET, (err: any, decoded: any) => {
        if (err) {
            const err = new Error('Authentication error. Invalid token')
            return next(err)
        }
        socket.user = decoded
        next()
    })
    
}
