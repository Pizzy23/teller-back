import { Injectable, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  private prismaInstances: { [key: string]: PrismaClient } = {};

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
      await this.$disconnect();
    });
  }

  async setDatabaseUrl(databaseUrl: string): Promise<PrismaClient> {
    if (!this.prismaInstances[databaseUrl]) {
      this.prismaInstances[databaseUrl] = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });
    }
    return this.prismaInstances[databaseUrl];
  }
}
