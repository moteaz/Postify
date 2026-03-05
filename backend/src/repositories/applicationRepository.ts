import { PrismaClient, Application } from '@prisma/client';

export class ApplicationRepository {
    constructor(private db: PrismaClient) {}

    async findById(id: string, userId: string) {
        return this.db.application.findFirst({
            where: { id, userId },
            include: { cv: true }
        });
    }

    async findByUserId(userId: string) {
        return this.db.application.findMany({
            where: { userId },
            orderBy: { generatedAt: 'desc' },
            include: { cv: true }
        });
    }

    async create(data: {
        userId: string;
        cvId: string;
        jobDescription: string;
        recruiterEmail?: string | null;
        subject?: string | null;
        coverLetter?: string | null;
    }): Promise<Application> {
        return this.db.application.create({
            data: {
                ...data,
                status: 'DRAFT'
            }
        });
    }

    async updateStatus(id: string, data: {
        status: string;
        sentAt?: Date;
        recruiterEmail?: string;
        subject?: string;
        coverLetter?: string;
    }): Promise<Application> {
        return this.db.application.update({
            where: { id },
            data: data as any
        });
    }
}
