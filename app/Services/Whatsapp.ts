import Drive from '@ioc:Adonis/Core/Drive'
import { Buttons, Client, MessageMedia } from 'whatsapp-web.js'
import parsePhoneNumber from 'libphonenumber-js'

class Whatsapp {
  public client: Client
  private booted = false

  private PUPPETEER_SESSION_CONFIG
  private PUPPETEER_SESSION_PATH = './puppeteer.json'

  public authenticated = false

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.config()

    this.booted = true
    this.client = new Client({
      restartOnAuthFail: true,
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process', // <- this one doesn't works in Windows
          '--disable-gpu',
          '--unhandled-rejections=strict',
        ],
      },
      session: this.PUPPETEER_SESSION_CONFIG,
    })

    this.client.initialize()
  }

  private async config() {
    if (await Drive.exists(this.PUPPETEER_SESSION_PATH)) {
      this.PUPPETEER_SESSION_CONFIG = await Drive.get(this.PUPPETEER_SESSION_PATH)
    }
  }

  public async login(session) {
    await Drive.put(this.PUPPETEER_SESSION_PATH, JSON.stringify(session))

    this.PUPPETEER_SESSION_CONFIG = session
    this.authenticated = true
  }

  public async logout() {
    this.PUPPETEER_SESSION_CONFIG = ''
    await Drive.delete(this.PUPPETEER_SESSION_PATH)
  }

  public restart() {
    this.client.destroy()
    this.client.initialize()
  }

  public async checkNumber(number) {
    const phoneNumber = parsePhoneNumber(number, 'ID')
    if (phoneNumber) {
      const isValid = await this.client.isRegisteredUser(phoneNumber.number)

      return isValid
    }
    return false
  }

  public formatNumber(number) {
    number = number.replace('@c.us', '')
    const phoneNumber = parsePhoneNumber(number, 'ID')
    if (phoneNumber) {
      number = phoneNumber.number.replace('+', '')
    }
    number = `${number}@c.us`
    return number
  }

  // chats
  public async getChats() {
    if (!this.authenticated) return false;

    return await this.client.getState();
  }

  public async getChatById(number) {
    if (!this.authenticated) return false;

    number = this.formatNumber(number)
    return await this.client.getChatById(number)
  }

  public async sendMessage(number, message, options = {}) {
    number = this.formatNumber(number)
    await this.client.sendMessage(number, message, options)
  }

  public async sendMessageButton(number, messageButtons) {
    const { title = null, message = null, footer = null, buttons = [] } = messageButtons
    let button = new Buttons(message, [...buttons], title, footer)
    await this.sendMessage(number, button)
  }

  public async sendMedia(number, filepath) {
    if (await Drive.exists(filepath)) {
      const media = MessageMedia.fromFilePath(filepath)
      await this.sendMessage(number, media, { sendAudioAsVoice: true })
    }
  }

  public async sendVoiceNote(number, filepath) {
    await this.sendMedia(number, filepath)
  }
}

export default new Whatsapp()
