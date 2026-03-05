import { PrismaClient, UserCV } from '@prisma/client';

export class CVRepository {
    constructor(private db: PrismaClient) {}

    async findById(id: string): Promise<UserCV | null> {
        return this.db.userCV.findUnique({ where: { id } });
    }

    async findByUserId(userId: string, includeArchived = false) {
        return this.db.userCV.findMany({
            where: { 
                userId,
                ...(includeArchived ? {} : { isArchived: false })
            },
            orderBy: { uploadedAt: 'desc' }
        });
    }

    async findActiveByUserId(userId: string): Promise<UserCV | null> {
        return this.db.userCV.findFirst({
            where: { userId, isActive: true }
        });
    }

    async create(data: {
        userId: string;
        fileName: string;
        fileKey: string;
        fileSize: number;
        mimeType: string;
    }): Promise<UserCV> {
        return this.db.userCV.create({
            data: {
                ...data,
                isActive: true
            }
        });
    }

    async setAllInactive(userId: string): Promise<void> {
        await this.db.userCV.updateMany({
            where: { userId },
            data: { isActive: false }
        });
    }

    async setActive(id: string): Promise<UserCV> {
        return this.db.userCV.update({
            where: { id },
            data: { isActive: true }
        });
    }

    async toggleArchive(id: string, isArchived: boolean): Promise<UserCV> {
        return this.db.userCV.update({
            where: { id },
            data: { isArchived }
        });
    }

    async delete(id: string): Promise<UserCV> {
        return this.db.userCV.delete({ where: { id } });
    }

    async countApplications(cvId: string): Promise<number> {
        return this.db.application.count({ where: { cvId } });
    }
}
