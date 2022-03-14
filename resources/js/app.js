import Alpine from 'alpinejs'
import { io } from 'socket.io-client'

import '../css/app.css'

Alpine.start()

const socket = io()
