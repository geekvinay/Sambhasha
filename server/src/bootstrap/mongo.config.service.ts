import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongoDBConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  getUri(){
    const uri = this.configService.get('database.uri');
    console.log(`Connecting to MongoDB at ${uri}`);
    return uri; 
  }

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    return {
      uri: this.configService.get<string>('database.uri'),
      // retryAttempts: Number.MAX_VALUE,
      // retryDelay: 500,
      // maxPoolSize: 50,
      // minPoolSize: 10,
      // socketTimeoutMS: 45000,
    };
  }
}
