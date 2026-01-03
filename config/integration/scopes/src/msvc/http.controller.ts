import { Controller, Get } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller()
export class HttpController {
  @Get('hello')
  testMsvc() {
    const client = ClientProxyFactory.create({
      timeoutMs: 5000,
      transport: Transport.TCP,
    });
    return client.send('test', { test: true });
  }
}
