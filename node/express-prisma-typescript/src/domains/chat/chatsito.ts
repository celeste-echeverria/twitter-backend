/*export const websocketRouter = (io: any) => {
    const followService: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db));
    const messageService: MessageService = new MessageServiceImpl(new MessageRepositoryImpl(db));
    //   io.origins(':');
    io.use(function (socket: any, next: any) {
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, Constants.TOKEN_SECRET, function (err: any, decoded: any) {
          if (err) return next(new Error('Authentication error'));
          socket.decoded = decoded;
          next();
        });
      } else {
        next(new Error('Authentication error'));
      }
    }).on('connection', async (socket: any) => {
      const userId = String(socket.decoded.userId);
      users.set(userId, socket.id);
      const messages = await messageService.getMessagesNotSend(userId);
      if (messages) {
        messages.map((msj) => {
          io.to(socket.id).emit('chat', { from: msj.authorToId, content: msj.content });
        });
      }
      await messageService.updateMessageNotSend(userId);
      socket.on('chat', async (data: any) => {
        const follow = await followService.validateFollow(userId, data.userId);
        if (follow) {
          if (users.get(data.userId)) {
            messageService.createMessage(userId, data.userId, data.message, true);
            io.to(users.get(data.userId)).emit('chat', { from: userId, content: data.message });
            io.to(users.get(userId)).emit('chat', { from: userId, content: data.message });
          } else {
            messageService.createMessage(userId, data.userId, data.message, false);
            io.to(socket.id).emit('chat', { content: 'El usuario no esta conectado' });
          }
        } else {
          io.to(socket.id).emit('chat', { content: 'No se siguen mutuamente' });
        }
      });
      socket.on('disconnect', (data: any) => {
        users.delete(userId);
      });
    })}*/