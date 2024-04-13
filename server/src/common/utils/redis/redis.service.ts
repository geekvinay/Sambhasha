import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {

	private client: Redis.Cluster | Redis.default;
	isClientConnected = false;
	enableCache = true;

	ENABLE_DISABLE_KEY = 'SAMBHASHA_CACHE_ENABLE_DISABLE_KEY';
	ENABLE_DISABLE_CHANNEL = 'SAMBHASHA_CACHE_ENABLE_DISABLE_CHANNEL';
	ENABLE_MESSAGE = 'SAMBHASHA_CACHE_ENABLE_MESSAGE';
	DISABLE_MESSAGE = 'SAMBHASHA_CACHE_DISABLE_MESSAGE';
	DEFAULT_TTL = 60 * 60 * 24;

	constructor(
		private configService: ConfigService,
	) {
		this.connect();
	}

	private async connect() {
		try {
			const redisConfig = this.configService.get('redis');
			console.log('redisConfig: ', redisConfig);
			const retryStrategy = (times) => {
				if (times > 5) {
					console.debug('maximum retry exeeded');
					return null;
				} else {
					console.debug('retrying... ' + times);
					return times;
				}
			};
			if (redisConfig?.url) {
				this.client = new Redis.default(redisConfig.url, {
					retryStrategy: retryStrategy,
				});
			} else if (redisConfig?.nodes) {
				this.client = new Redis.Cluster(redisConfig.nodes, {
					clusterRetryStrategy: retryStrategy,
				});
			} else return;


			this.client.on('error', (err) => {
				console.error('Redis Client Error: ', err);
				this.isClientConnected = false;
			});


			this.client.on('ready', async () => {
				this.isClientConnected = true;
				console.debug('Redis Client Connected Successfuly');
				if (this.client.isCluster) {
					console.debug('Redis Cluster mode is enabled');
				}
				try {
					//enable key expired notification
					this.client.config('SET', 'notify-keyspace-events', 'Ex');

					//check whether cache is disabled
					const message = await this.client.get(this.ENABLE_DISABLE_KEY);
					if (message == this.DISABLE_MESSAGE) {
						this.enableCache = false;
						console.debug('Cache is Disabled');
					} else if (this.enableCache) {
						console.debug('Cache is Enabled');
					}

					// subscribe to enable disable cache Channel
					const subscriber = this.client.duplicate();
					subscriber.on('error', (err) => {
						console.error('Redis Subscriber Error: ', err);
					});
					await subscriber.subscribe(this.ENABLE_DISABLE_CHANNEL);
					subscriber.on('message', (channel, message) => {
						if (channel == this.ENABLE_DISABLE_CHANNEL) {
							if (message == this.ENABLE_MESSAGE) {
								this.enableCache = true;
								console.debug('Cache is Enabled');
							} else if (message == this.DISABLE_MESSAGE) {
								this.enableCache = false;
								console.debug('Cache is Disabled');
							}
						}
					});
				} catch (error) {
					console.error(error);
				}
			});
		} catch (error) {
			console.error('Redis Client Connection Error: ', error);
			this.isClientConnected = false;
		}
	}

	async enable() {
		try {
			await this.client.set(this.ENABLE_DISABLE_KEY, this.ENABLE_MESSAGE);
			await this.client.publish(
				this.ENABLE_DISABLE_CHANNEL,
				this.ENABLE_MESSAGE,
			);
			return;
		} catch (error) {
			console.error('Enable Cache Error: ', error);
		}
	}
	async disable() {
		try {
			await this.client.set(this.ENABLE_DISABLE_KEY, this.DISABLE_MESSAGE);
			await this.client.publish(
				this.ENABLE_DISABLE_CHANNEL,
				this.DISABLE_MESSAGE,
			);
			return;
		} catch (error) {
			console.error('Disable Cache Error: ', error);
		}
	}

	async get(key: string) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			const data = await this.client.get(key);
			console.log('data: ', data);
			if (data) {
				console.debug(`found cache for key: ${key}`);
				return JSON.parse(data);
			}
		} catch (error) {
			console.error(
				'get Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async set(key: string, data: any, ttl?: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			data = JSON.stringify(data);
			await this.client.set(key, data);
			if (!ttl) ttl = 60 * 60 * 24;
			await this.client.expire(key, ttl);
			return;
		} catch (error) {
			console.error(
				'set Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async setnx(key: string, data: any, ttl?: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			data = JSON.stringify(data);
			const res = await this.client.setnx(key, data);
			if (!ttl) ttl = 60 * 10; //10 minutes
			this.client.expire(key, ttl, 'NX');
			return res;
		} catch (error) {
			console.error(
				'setnx Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async incrBy(key: string, number: number, ttl?: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			const result = await this.client.incrby(key, number);
			if (!ttl) ttl = 60 * 60 * 24;
			await this.client.expire(key, ttl);
			return result;
		} catch (error) {
			console.error(
				'incrBy Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async decrBy(key: string, number: number, ttl?: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			const result = await this.client.decrby(key, number);
			if (!ttl) ttl = 60 * 60 * 24;
			await this.client.expire(key, ttl);
			return result;
		} catch (error) {
			console.error(
				'decrby Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async hGet(hKey: string, key: string) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			const data = await this.client.hget(hKey, key);
			if (data) {
				console.debug(`found cache for hKey: ${hKey}, key: ${key}`);
				return JSON.parse(data);
			}
		} catch (error) {
			console.error(
				'hGet Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async hSet(hKey: string, key: string, data: any, ttl?: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			data = JSON.stringify(data);
			if (!ttl) ttl = 60 * 60 * 24;
			await this.client.hset(hKey, key, data);
			if (this.client.isCluster) {
				await this.client.expire(hKey, ttl, 'NX'); //required redis version above 7
			} else {
				const todayAt12 = new Date().setHours(23, 59, 59, 999);
				await this.client.expireat(hKey, Math.floor(todayAt12 / 1000));
			}
			return;
		} catch (error) {
			console.error(
				'hSet Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async hDel(hKey: string, key: string | string[]) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}

			let data = null;
			if (Array.isArray(key)) {
				data = await Promise.all(key.map((k) => this.client.hdel(hKey, k)));
				// data = key.length && (await this.client.hdel(hKey, ...key));
			} else {
				data = await this.client.hdel(hKey, key);
			}
			if (data)
				console.debug(
					`deleted cache for hKey: ${hKey.toString()}, key: ${key.toString()}`,
				);

			return;
		} catch (error) {
			console.error(
				'hDel Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async del(key: string | string[]) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}

			let data = null;
			if (Array.isArray(key)) {
				data = await Promise.all(key.map((k) => this.client.del(k)));
				// data = key.length && (await this.client.del(...key));
			} else {
				data = await this.client.del(key);
			}
			if (data) console.debug(`deleted cache for key: ${key.toString()}`);

			return;
		} catch (error) {
			console.error(
				'del Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async lPush(key: string, data: string | string[], expireAt?: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			if (data.length && Array.isArray(data)) {
				await this.client.lpush(key, ...data);
				expireAt && await this.client.expireat(key, expireAt);
				return;
			} else {
				await this.client.lpush(key, data as string);
				expireAt && await this.client.expireat(key, expireAt);
				return;
			}
		} catch (error) {
			console.error(
				'lPush Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return null;
		}
	}

	async lRange(Key: string, start: number = 0, stop: number = -1) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			return await this.client.lrange(Key, start, stop);
		} catch (error) {
			console.error(
				'lRange Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async rPush(key: string, data: string | string[], expireAt?: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			if (data.length && Array.isArray(data)) {
				await this.client.rpush(key, ...data);
				expireAt && await this.client.expireat(key, expireAt);
				return;
			} else {
				await this.client.rpush(key, data as string);
				expireAt && await this.client.expireat(key, expireAt);
				return;
			}
		} catch (error) {
			console.error(
				'rPush Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async rPop(key: string) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			return await this.client.rpop(key);
		} catch (error) {
			console.error(
				'rPop Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async rPop_lPush(key1: string, key2: string) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			return await this.client.rpoplpush(key1, key2);
		} catch (error) {
			console.error(
				'rPop_lPush Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async lLen(key: string) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			return await this.client.llen(key);
		} catch (error) {
			console.error(
				'lLen Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async lSet(key: string, index: number, value: string) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			await this.client.lset(key, index, value);
			return;
		} catch (error) {
			console.error(
				'lSet Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async lIndex(key: string, index: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			const data = await this.client.lindex(key, index);
			return JSON.parse(data);
		} catch (error) {
			console.error(
				'lIndex Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async deleteByPattern(pattern: string) {
		if (!(this.enableCache && this.isClientConnected)) {
			throw new HttpException('Redis Client Not Connected', 400);
		}
		const taskKey = 'INVALIDATING....' + pattern;
		const isRunning = await this.get(taskKey);
		if (isRunning) throw new HttpException('Task is locked', 400);

		await this.set(taskKey, 'Running...', 5 * 60);
		const nodes = this.client.isCluster
			? (this.client as any).nodes()
			: [this.client];
		nodes.forEach((node, i) => {
			const stream = node.scanStream({ match: `${pattern}*`, count: 1000 }); //todo
			stream.on('data', (keys = []) => {
				this.del(keys);
			});
			stream.on('end', () => {
				if (i == nodes.length - 1) {
					//delete task key for last node
					this.del(taskKey);
				}
			});
			stream.on('error', (err) => {
				console.error(err);
			});
		});
		return;
	}

	async subscribeExpireListener(callback: (data: { channel: string, message: string }) => void) {
		const subscriber = this.client.duplicate();
		subscriber.subscribe('__keyevent@0__:expired');

		subscriber.on('message', (channel: string, message: string) => {
			// handle expired key event
			callback({ channel, message });
		});
	}

	async tsAdd(key: string, timeStamp: number, value: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			return await this.client.sendCommand(
				new Redis.Command('TS.ADD',
				[key, timeStamp, value]
				)
			);
		} catch (error) {
			console.error(
				'TS.ADD Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return;
		}
	}

	async tsRange(key: string, fromTimeStamp: number, toTimeStamp: number) {
		try {
			if (!(this.enableCache && this.isClientConnected)) {
				console.debug('Redis Client Not Connected');
				return;
			}
			const data: any = await this.client.sendCommand(
				new Redis.Command('TS.RANGE',
				[key, fromTimeStamp, toTimeStamp, 'AGGREGATION', 'sum', '3600000', 'ALIGN', fromTimeStamp]
				)
			)
			return data.reduce((accumulator, [timestamp, value]) => {
				accumulator += parseInt(value.toString());
				return accumulator;
			}, 0) || 0;
		} catch (error) {
			console.error(
				'TS.RANGE Error:',
				error,
				'arguments: ',
				JSON.stringify(arguments),
			);
			return 0;
		}
	}
}
