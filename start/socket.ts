import Socket from 'App/Services/Socket'
import Whatsapp from 'App/Services/Whatsapp'

Socket.boot()

/**
 * Listen for incoming socket connections
 */
Socket.io.on('connection', (socket) => {
  socket.emit('ping', { message: 'hello' })

  socket.on('pong', (data) => {
    console.log(data)
  })

  socket.on('wa:getChats', async () => {
    console.log('server:wa:getChats')
    let result = await Whatsapp.client.getChats()
    // if (result) socket.emit('wa:setChats', { data: result })
    console.log(JSON.stringify(result))
  })

  socket.on('wa:getChatById', async ({phone}) => {
    console.log('server:wa:getChatById')
    let result = await Whatsapp.client.getChatById(phone)
    // if (result) socket.emit('wa:setChatById', { data: result })
    console.log(JSON.stringify(result))
  })
})
