import { CreateMessageInputDTO, CreateRoomInputDTO } from '@domains/chat/dto';

import { FollowService, FollowServiceImpl } from '@domains/follow/service';
import { ChatService, ChatServiceImpl } from '../service';

const chatService: ChatService = new ChatServiceImpl()
const followService: FollowService = new FollowServiceImpl()

export const handleConnection = async (socket: any): Promise<void> => {

  const userId: string = socket.user.userId
  console.log('USER CONNECTED:', userId);

  socket.on('joinChat', async () => {
    const availableChats = await followService.getMutuals(userId)

    if(!availableChats) socket.emit('joinChat', []);
    else socket.emit('joinChat', availableChats)
  });

  socket.on('joinRoom', async ({otherUserId}: CreateRoomInputDTO) => {
    
    const room = await chatService.createRoom(userId, otherUserId);

    if(!room) socket.emit('error', { description: 'Cannot create chat' })
    
    socket.join(room?.id);
    socket.emit('joinRoom', room);

  });

  socket.on('sendMessage', async ({chatId, content}: CreateMessageInputDTO) => {
    console.log('SENDMESSAGE RECEIVED: ', chatId, content)

    const message = await chatService.createMessage(userId, chatId, content);

    if (!message){
      socket.emit('error', { description: 'Could not send message' });
      return
    }
    socket.to(message.chatId).emit('sendMessage', message);
    socket.emit('sendMessage', message);
  });

  socket.on('disconnect', () => console.log('user disconnected'));

}
