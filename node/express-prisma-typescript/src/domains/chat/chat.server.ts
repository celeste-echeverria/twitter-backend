import { httpServer, io } from '@server'
import { chatAuth } from './middleware/chat.middleware'
import { ChatService, ChatServiceImpl } from './service'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'

const chatService: ChatService = new ChatServiceImpl()
const followService: FollowService = new FollowServiceImpl()

export const handleConnection = async (socket: any): Promise<void> => {
  //mostrar rooms disponibles  
  console.log('a user connected')

  const userId = socket.user.userId
  const availableUsers = await followService.getMutuals(userId)
  console.log('Available chats:', availableUsers.map(user => {return user.name}))
  socket.emit('available_chats', availableUsers);

  socket.on('join_room', async (targetUserId: string) => {
    const isMutual = availableUsers.some(user => user.id === targetUserId);
    console.log('target:', targetUserId)
    if (isMutual) {
      const roomId = await chatService.getOrCreateRoom(userId, targetUserId);
      socket.join(roomId);
      socket.emit('joined_room', roomId);
      console.log(`User ${userId} joined room ${roomId}`);
    } else {
      socket.emit('error', 'You cannot join this room');
    }
  });

  socket.on('chat_message', (data: { roomId: string; message: string }) => {
  const { roomId, message } = data;
  console.log(`Emitting message to room ${roomId}: ${message}`);
  socket.to(roomId).emit('chat_message', { sender: userId, message });
});
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
}
