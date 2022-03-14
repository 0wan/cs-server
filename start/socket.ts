import Socket from 'App/Services/Socket'

Socket.boot()

/**
 * Listen for incoming socket connections
 */
Socket.io.on('connection', (socket) => {
  socket.emit('ping', { message: 'hello' })

  socket.on('pong', (data) => {
    console.log(data)
  })
})
