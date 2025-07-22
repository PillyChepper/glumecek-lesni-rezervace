/**
 * Simple logging utility to replace console statements
 * In production, you can extend this to send logs to a service
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

const createLogger = (): Logger => {
  const isDevelopment = import.meta.env.DEV;
  
  const log = (level: LogLevel, message: string, ...args: any[]) => {
    if (!isDevelopment && level === 'debug') return;
    
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'error':
        console.error(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'debug':
        if (isDevelopment) console.log(prefix, message, ...args);
        break;
    }
  };
  
  return {
    info: (message: string, ...args: any[]) => log('info', message, ...args),
    warn: (message: string, ...args: any[]) => log('warn', message, ...args),
    error: (message: string, ...args: any[]) => log('error', message, ...args),
    debug: (message: string, ...args: any[]) => log('debug', message, ...args),
  };
};

export const logger = createLogger();