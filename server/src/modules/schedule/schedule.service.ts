import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomBytes } from 'crypto';

@Injectable()
export class SessionService {
    private sdk100msConfig;
    constructor(
        private configService: ConfigService,
        private scheduleRepository: ScheduleRepository,
    ) {
        this.sdk100msConfig = this.configService.get("sdk100ms");
        console.log('templateId: ', this.sdk100msConfig.templateId);
        console.log('managementToken: ', this.sdk100msConfig.managementToken);
    }

    getHello(): string {
        return 'Hello World!';
    }

    async createSchedule(body: any) {
        try {
            let dbData = await this.scheduleRepository.create(body);

            // Append roomDetails on to scheduleObject
            const roomDetails = await this.createRoom({ roomName: body.name, description: body.description });

            // Append roomCodes on to roomCodes
            const roomCodes = await this.getRoomCodes(roomDetails.id);
            const roomCodesMapped = roomCodes.data.map((data) => {
                return {
                    code: data.code,
                    role: data.role,
                };
            });
            const uniqueCode = this.generateRandomScheduleCode();
            return await this.scheduleRepository.findOneAndUpdate({ _id: dbData._id }, { roomCodes: roomCodesMapped, uniqueCode: uniqueCode });
        } catch (error) {
            console.error('Error creating schedule:', error);
            return null;
        }
    }

    async getSchedule(uniqueCode: string) {
        try {
            const dbData = await this.scheduleRepository.fetchOne({
                searchParams: {
                    uniqueCode: uniqueCode
                }
            });
            return dbData;
        } catch (error) {
            console.error('Error fetching schedule:', error);
            return null;
        }
    }

    createRoom = async ({ roomName = "Room Name", description = "Room Description" }) => {
        try {
            const body = {
                name: roomName,
                description: description,
                template_id: this.sdk100msConfig.templateId,
                region: 'us'
            };
            const headerConfig = {
                headers: {
                    'Authorization': `Bearer ${this.sdk100msConfig.managementToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.post('https://api.100ms.live/v2/rooms', body, headerConfig);
            return response.data;
        } catch (error) {
            console.error('Error creating room:', error);
            return null;
        }
    };

    getRoomCodes = async (roomId: string) => {
        try {
            const headers = {
                headers: {
                    'Authorization': `Bearer ${this.sdk100msConfig.managementToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.post(`https://api.100ms.live/v2/room-codes/room/${roomId}`, {}, headers);
            return response.data;
        } catch (error) {
            console.error('Error getting room codes:', error.message);
            return null;
        }
    };

    // Function to generate a random 4-digit number
    generateRandomScheduleCode(): string {
        const code = randomBytes(3).toString('hex').toUpperCase(); // Generate 2 random bytes (4 hexadecimal characters)
        return code;
    }
}