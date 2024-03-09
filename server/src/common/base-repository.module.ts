import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { CacheService } from '../../bootstrap/cache/cache.service';
import { getProviders } from './base-repository.providers';
import { UtilityService } from './utils/utility.service';

/**module contains mongoose module and base repository providers*/
@Module({})
export class RepositoryModule {
  static forFeature(features): DynamicModule {
    return {
      module: RepositoryModule,
      imports: [MongooseModule.forFeature(features)],
      providers: [
        ...getProviders(features),
        // CacheService,
        UtilityService,
      ],
      exports: [...getProviders(features)],
    };
  }
}
