import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyStrategy } from './auth/api-key.strategy';
import { AccountsController } from './controllers/accounts.controller';
import { AppController } from './controllers/app.controller';
import { BlocksController } from './controllers/blocks.controller';
import { ExtrinsicsController } from './controllers/extrinsics.controller';
import {
  Accounts,
  ApiDailyUsage,
  ApiKey,
  ApiKeysDailyUsage,
  ApiKeysMonthlyUsage,
  ApiMonthlyUsage,
  Blocks,
  ConsensusMetadata,
  Extrinsics,
  FilesMetadata,
  LeaderboardMetadata,
  Profile,
  StakingMetadata,
} from './entities';
import { ApiUsageService } from './services/api-usage.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'postgres',
      entities: [
        Blocks,
        Extrinsics,
        ApiKey,
        Profile,
        ApiDailyUsage,
        ApiMonthlyUsage,
        ApiKeysDailyUsage,
        ApiKeysMonthlyUsage,
        Accounts,
        ConsensusMetadata,
        LeaderboardMetadata,
        FilesMetadata,
        StakingMetadata,
      ],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      Blocks,
      Extrinsics,
      ApiKey,
      Profile,
      ApiDailyUsage,
      ApiMonthlyUsage,
      ApiKeysDailyUsage,
      ApiKeysMonthlyUsage,
      Accounts,
      ConsensusMetadata,
      LeaderboardMetadata,
      FilesMetadata,
      StakingMetadata,
    ]),
    PassportModule.register({ defaultStrategy: 'api-key' }),
  ],
  controllers: [
    AppController,
    BlocksController,
    ExtrinsicsController,
    AccountsController,
  ],
  providers: [ApiKeyStrategy, ApiUsageService],
})
export class AppModule {}
