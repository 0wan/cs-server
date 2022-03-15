import Alpine from 'alpinejs'
import { io } from 'socket.io-client'

const socket = io()
window.io = socket

Alpine.store('chats', {
  items: [],

  init() {
    window.addEventListener('wa:authenticated', function () {
      socket.emit('wa:getChats')
    })

    // socket.on('wa:setChats', ({ data }) => {
    //   this.items = data
    // })

    // window.addEventListener('wa:', function () {    })
  }
})

Alpine.store('messages', {
  items: [],
  phoneNumber: null,

  switchChat(phone) {
    this.clear()
    this.fetchMessages(phone)

    this.phoneNumber = phone
    this.listening(phone)
  },

  fetchMessages(phone) {
    socket.emit('wa:getChatbyId', { phone: phone})
  },

  setMessages(data) {
    this.items = data
  },

  sendMessage(payload) {
    this.items.push(payload)
  },

  sendMedia(payload) {

  },

  clear() {
    this.items = []
  },

  init() {
    socket.on('wa:message', ({ data }) => {
      if (data.from == this.phoneNumber) this.sendMessage(data)
    })
  },

  listening(phone) {
    socket.on('wa:message:' + phone, ({ data }) => {
      this.sendMessage(data)
    })
  }
})


Alpine.start()

document.addEventListener('DOMContentLoaded', function () {})
