import { Test, TestingModule } from '@nestjs/testing';
import { MailingServiceController } from './mailing-service.controller';

describe('MailingServiceController', () => {
  let controller: MailingServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailingServiceController],
    }).compile();

    controller = module.get<MailingServiceController>(MailingServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
