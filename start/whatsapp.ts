import qrcode from 'qrcode'
import Socket from 'App/Services/Socket'
import Whatsapp from 'App/Services/Whatsapp'

Whatsapp.boot()

Whatsapp.client.on('message', async (message) => {
  // Download
  if (message.hasMedia) {
  }
})

Whatsapp.client.on('message_ack', (message) => {
  Socket.io.emit('wa:message_ack', { data: message })
})
Whatsapp.client.on('message_create', (message) => {
  Socket.io.emit('wa:message_create', { data: message })
})
Whatsapp.client.on('message_revoke_everyone', (message) => {
  Socket.io.emit('wa:message_revoke_everyone', { data: message })
})
Whatsapp.client.on('message_revoke_me', (message) => {
  Socket.io.emit('wa:message_revoke_me', { data: message })
})

Whatsapp.client.on('media_uploaded', (message) => {
  Socket.io.emit('wa:media_uploaded', { data: message })
})

Whatsapp.client.on('qr', (qr) => {
  if (!Whatsapp.authenticated)
    qrcode.toDataURL(qr, (_err, result) => {
      Socket.io.emit('wa:qr', result)
    })
})

Whatsapp.client.on('ready', () => {
  Socket.io.emit('wa:ready', { data: 'ready' })
})

Whatsapp.client.on('auth_failure', async () => {
  await Whatsapp.logout()

  Socket.io.emit('wa:auth_failure', { data: 'auth_failure' })
})
Whatsapp.client.on('authenticated', async (ClientSession) => {
  await Whatsapp.login(ClientSession)

  Socket.io.emit('wa:authenticated', { data: 'authenticated' })
})

// @ts-ignore
Whatsapp.client.on('change_battery', (BatteryInfo) => {
  Socket.io.emit('wa:change_battery', { data: 'change_battery' })
})

// @ts-ignore
Whatsapp.client.on('change_state', (state) => {
  Socket.io.emit('wa:change_state', { data: 'change_state' })
})

// @ts-ignore
Whatsapp.client.on('disconnected', (state) => {
  Socket.io.emit('wa:disconnected', { data: 'disconnected' })
})

// @ts-ignore
Whatsapp.client.on('group_join', (GroupNotify) => {
  Socket.io.emit('wa:group_join', { data: 'group_join' })
})

// @ts-ignore
Whatsapp.client.on('group_leave', (GroupNotify) => {
  Socket.io.emit('wa:group_leave', { data: 'group_leave' })
})

// @ts-ignore
Whatsapp.client.on('group_update', (GroupNotify) => {
  Socket.io.emit('wa:group_update', { data: 'group_update' })
})

Whatsapp.client.on('incoming_call', () => {
  Socket.io.emit('wa:incoming_call', { data: 'incoming_call' })
})
