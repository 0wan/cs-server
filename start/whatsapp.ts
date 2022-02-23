import qrcode from 'qrcode'
import Socket from "App/Services/Socket";
import Whatsapp from "App/Services/Whatsapp";

Whatsapp.boot();

Whatsapp.client.on('message', async message => {

  // Download
  if(message.hasMedia) {

  }
})

Whatsapp.client.on('qr', (qr) => {
  qrcode.toDataURL(qr, (_err, result) => {
    Socket.io.emit('wa:qr', result);
  })
})
