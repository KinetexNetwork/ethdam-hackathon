import { Test, TestingModule } from '@nestjs/testing';
import { RewardSettingsService } from './reward-settings.service';

describe('RewardSettingsService', () => {
  let service: RewardSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RewardSettingsService],
    }).compile();

    service = module.get<RewardSettingsService>(RewardSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
