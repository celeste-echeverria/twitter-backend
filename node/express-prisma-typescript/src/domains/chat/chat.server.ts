import { validate } from 'class-validator'
import { ChatService, ChatServiceImpl } from './service'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'

const chatService: ChatService = new ChatServiceImpl()
const followService: FollowService = new FollowServiceImpl()
const users = new Map<string, string>()

export const handleConnection = async (socket: any): Promise<void> => {
  console.log('a user connected:', socket.user.userId)
  const userId: string = socket.user.userId
  console.log(userId)
  const availableUsers = await followService.getMutuals(userId)
  
  //test:
  console.log('Available chats:', availableUsers.map(user => {return [user.id, user.name]}))

  users.set(userId, socket.id);

  socket.on('chat', async (data: any) => {
    console.log(data)
    console.log(data.message)
    const mutuals = await followService.usersAreMutuals(userId, data.toUserId)
    if (mutuals) {
      if (users.get(data.toUserId)) {
        await chatService.saveMessage(userId, data.toUserId, data.message);
        socket.to(users.get(data.toUserId)).emit('chat', { from: userId, content: data.message });
      } else {
        await chatService.saveMessage(userId, data.toUserId, data.message,);
        socket.to(socket.id).emit('chat', { content: `${data.toUserId} is not online.` });
      }
    } else {
      socket.to(socket.id).emit('chat', { content: 'You do not follow each other.' });
    }
  });
  
  socket.on('disconnect', () => {
    console.log(`${userId} disconnected.`)
    users.delete(userId)
  })
}
