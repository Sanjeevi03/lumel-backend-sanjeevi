import { pino } from "pino";

const pinoLogger = pino({
  transport: {
    target:"pino-pretty",
    options: {
      colorzie: true,
      ignore: 'pid, hostname'
    }
  }
})

export default pinoLogger;