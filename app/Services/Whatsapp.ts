import Drive from '@ioc:Adonis/Core/Drive'
import { Client } from 'whatsapp-web.js'

class Whatsapp {
  public client: Client
  private booted = false

  private PUPPETEER_SESSION_CONFIG;
  private PUPPETEER_SESSION_PATH = './puppeteer.json';

  public authenticated = false;

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
            '--unhandled-rejections=strict'
        ]},
        session: this.PUPPETEER_SESSION_CONFIG
    })

    this.client.initialize();
  }

  private async config() {
    if (await Drive.exists(this.PUPPETEER_SESSION_PATH)) {
      this.PUPPETEER_SESSION_CONFIG = await Drive.get(this.PUPPETEER_SESSION_PATH)
    }
  }

  public async login(session) {
    await Drive.put(this.PUPPETEER_SESSION_PATH, JSON.stringify(session))

    this.PUPPETEER_SESSION_CONFIG = session
    this.authenticated = true;
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
    const isValid = await this.client.isRegisteredUser(number)

    return isValid;
  }

}

export default new Whatsapp()
