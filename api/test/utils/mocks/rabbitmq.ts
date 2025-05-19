import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { MessageBrokerService } from '@/utils/services/message-broker-service';

@Module({
  providers: [
    {
      provide: AmqpConnection,
      useValue: createMock<AmqpConnection>(),
    },
    MessageBrokerService,
  ],
  exports: [AmqpConnection, MessageBrokerService],
})
export class MockRabbitCustomModule {}
