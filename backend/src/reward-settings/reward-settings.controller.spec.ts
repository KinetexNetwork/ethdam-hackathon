import { Test, TestingModule } from '@nestjs/testing';
import { RewardSettingsController } from './reward-settings.controller';

describe('RewardSettingsController', () => {
  let controller: RewardSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardSettingsController],
    }).compile();

    controller = module.get<RewardSettingsController>(RewardSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
