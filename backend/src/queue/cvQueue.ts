import amqp, { Channel, ChannelModel } from 'amqplib';
import { logger } from '../infrastructure/logging/logger.js';
import { env } from '../config/env.js';

const QUEUE_NAME = 'cv.parse';
const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 10;

let connection: ChannelModel | null = null;
let channel: Channel | null = null;
let reconnectAttempts = 0;
let isConnecting = false;

export interface CVJobPayload {
  cvId: string;
  fileKey: string;
  mimeType: string;
  userId: string;
  buffer?: string; // Base64 encoded buffer
}

const setupConnectionHandlers = (conn: ChannelModel): void => {
  conn.on('error', (err) => {
    logger.error('RabbitMQ connection error', { error: err.message });
  });

  conn.on('close', () => {
    logger.warn('RabbitMQ connection closed, attempting reconnect...');
    connection = null;
    channel = null;
    scheduleReconnect();
  });
};

const setupChannelHandlers = (ch: Channel): void => {
  ch.on('error', (err) => {
    logger.error('RabbitMQ channel error', { error: err.message });
  });

  ch.on('close', () => {
    logger.warn('RabbitMQ channel closed');
    channel = null;
  });
};

const scheduleReconnect = (): void => {
  if (isConnecting || reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      logger.error('Max reconnection attempts reached');
    }
    return;
  }

  reconnectAttempts++;
  const delay = RECONNECT_DELAY * reconnectAttempts;
  
  logger.info('Scheduling reconnect', { attempt: reconnectAttempts, delayMs: delay });
  
  setTimeout(() => {
    connectQueue().catch((err) => {
      logger.error('Reconnection failed', { error: err.message });
    });
  }, delay);
};

export const connectQueue = async (): Promise<void> => {
  if (isConnecting) {
    logger.debug('Connection already in progress');
    return;
  }

  if (connection && channel) {
    logger.debug('Already connected to RabbitMQ');
    return;
  }

  isConnecting = true;

  try {
    const conn = await amqp.connect(env.RABBITMQ_URL, {
      heartbeat: 60,
    });
    connection = conn;

    setupConnectionHandlers(conn);

    channel = await conn.createChannel();
    setupChannelHandlers(channel!);

    await channel!.assertQueue(QUEUE_NAME, { 
      durable: true,
      arguments: {
        'x-queue-type': 'classic'
      }
    });

    reconnectAttempts = 0;
    isConnecting = false;
    
    logger.info('RabbitMQ connected', { queue: QUEUE_NAME });
  } catch (error) {
    isConnecting = false;
    logger.error('RabbitMQ connection failed', { 
      error: (error as Error).message,
      attempt: reconnectAttempts 
    });
    
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      scheduleReconnect();
    } else {
      throw error;
    }
  }
};

export const publishCVJob = async (payload: CVJobPayload): Promise<void> => {
  if (!channel) {
    logger.warn('Channel not available, attempting reconnect');
    await connectQueue();
    
    if (!channel) {
      throw new Error('RabbitMQ channel not available after reconnect attempt');
    }
  }

  try {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });

    logger.info('CV parse job published', { cvId: payload.cvId });
  } catch (error) {
    logger.error('Failed to publish job', { error: (error as Error).message });
    throw error;
  }
};

export const getChannel = (): Channel => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};

export const closeConnection = async (): Promise<void> => {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
    if (connection) {
      await (connection as ChannelModel).close();
      connection = null;
    }
    logger.info('RabbitMQ connection closed gracefully');
  } catch (error) {
    logger.error('Error closing RabbitMQ connection', { error: (error as Error).message });
  }
};

export const isConnected = (): boolean => {
  return connection !== null && channel !== null;
};
