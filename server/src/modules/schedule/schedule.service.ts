import { Injectable, Post } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
const agora = require('agora-access-token');
const axios = require('axios');

@Injectable()
export class SessionService {
    private sdk100ms = this.configService.get("sdk100ms");

    constructor(
        private scheduleRepository: ScheduleRepository,
        private configService: ConfigService,
    ) {
        console.log('templateId: ', this.sdk100ms.templateId);
        console.log('managementToken: ', this.sdk100ms.managementToken);
    }


    getHello(): string {
        return 'Hello Worlds!';
    }

    async createSchedule(body: any) {
        const res = await this.scheduleRepository.create(body);
        const roomDetails = await this.createRoom({ roomName: body.name, description: body.description });
        console.log('roomDetails: ', roomDetails);
        const roomCodes = await this.getRoomCodes(roomDetails);
        console.log('roomCodes: ', roomCodes);
        console.log('res: ', res);
        return { ...res, roomCodes };
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



    createRoom = async ({ roomName = "Room Name", description = "Room Description" }) => {
        try {
            const response = await axios.post('https://api.100ms.live/v2/rooms', {
                name: roomName,
                description: description,
                template_id: this.sdk100ms.templateId,
                region: 'us'
            }, {
                headers: {
                    'Authorization': `Bearer ${this.sdk100ms.managementToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('response.data: ', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating room:', error);
            return null;
        }
    };

    getRoomCodes = async (roomDetails) => {
        try {
            const response = await axios.post('https://api.100ms.live/v2/room-codes/room/' + roomDetails.id, {}, {
                headers: {
                    'Authorization': `Bearer ${this.sdk100ms.managementToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('response.data: ', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating room:', error);
            return null;
        }
    };
}
