import { Injectable, Post } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { Types } from 'mongoose';
const agora = require('agora-access-token');

@Injectable()
export class SessionService {
    constructor(private scheduleRepository: ScheduleRepository) { }
    getHello(): string {
        return 'Hello Worlds!';
    }

    async createSchedule(body: any) {
        console.log('body: ', body);
        const res = await this.scheduleRepository.create(body);
        console.log('res: ', res);
        return res;
    }

    async getSchedule(params: any) {
        console.log('body: ', params);
        const res = await this.scheduleRepository.fetchOne({
            searchParams: {
                _id: new Types.ObjectId(params.scheduleId)
            }
        });
        console.log('res: ', res);
        return res;
    }

    async getAgoraToken(params: any) {
        console.log(params.scheduleId);
        const appId = process.env.AGORA_APP_ID;
        const appCertificate = process.env.AGORA_APP_CERTIFICATE;
        const channelName = params.scheduleId;
        console.log('appId: ', appId);
        console.log('appCertificate: ', appCertificate);
        console.log('channelName: ', channelName);
        const expirationTimeInSeconds = 3600;
        
        const token = agora.RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            expirationTimeInSeconds
        );
        return token
        
    }
}
