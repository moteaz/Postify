import { PrismaClient, User } from '@prisma/client';

export class UserRepository {
    constructor(private db: PrismaClient) {}

    async findById(id: string): Promise<User | null> {
        return this.db.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.db.user.findUnique({ where: { email } });
    }

    async findByProvider(provider: string, providerAccountId: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: provider as any,
                    providerAccountId
                }
            }
        });
    }

    async create(data: {
        email: string;
        name?: string;
        avatarUrl?: string;
        provider: string;
        providerAccountId: string;
        role?: string;
    }): Promise<User> {
        return this.db.user.create({
            data: {
                ...data,
                provider: data.provider as any,
                role: (data.role as any) || 'USER'
            }
        });
    }

    async findAll(orderBy: any = { createdAt: 'desc' }) {
        return this.db.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        cvs: true,
                        applications: true
                    }
                }
            },
            orderBy
        });
    }

    async delete(id: string): Promise<User> {
        return this.db.user.delete({ where: { id } });
    }
}
