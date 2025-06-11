
// mock dotenv.config() เพื่อป้องกันการโหลดไฟล์ .env จริงในเทสต์
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Environment Configuration', () => {
  // รีเซ็ตโมดูลและ environment variables ทุกครั้งก่อนเทสต์ เพื่อให้แต่ละเทสต์แยกกันอย่างชัดเจน
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...process.env } as NodeJS.ProcessEnv;
    delete process.env.NODE_ENV;
  });

  describe('required function', () => {
    it('should return the value of an existing environment variable', () => {
      process.env.TEST_VAR = 'test-value';

      const { required } = require('../../src/config/env');
      expect(required('TEST_VAR')).toBe('test-value');
    });

    it('should throw an error for missing environment variable', () => {
      const { required } = require('../../src/config/env');
      expect(() => required('MISSING_VAR')).toThrowError(
        'Missing required environment variable: MISSING_VAR'
      );
    });
  });


  describe('env object', () => {
    it('should use default PORT when not set', () => {
      const { env } = require('../../src/config/env');
      expect(env.PORT).toBe(3000);
    });

    it('should use provided PORT when set', () => {
      process.env.PORT = '8080';
      const { env } = require('../../src/config/env'); // reload module หลังจากตั้ง env ใหม่
      expect(env.PORT).toBe(8080); // PORT ควรเป็น number ไม่ใช่ string
    });

    it('should use default JWT_SECRET when not set', () => {
      const { env } = require('../../src/config/env');
      expect(env.JWT_SECRET).toBe('default-secret');
    });

    it('should use provided JWT_SECRET when set', () => {
      process.env.JWT_SECRET = 'custom-secret';
      const { env } = require('../../src/config/env');
      expect(env.JWT_SECRET).toBe('custom-secret');
    });

    it('should return NODE_ENV when set', () => {
      process.env.NODE_ENV = 'production';
      const { env } = require('../../src/config/env');
      expect(env.NODE_ENV).toBe('production');
    });

    it('should return undefined for NODE_ENV when not set', () => {
      const { env } = require('../../src/config/env');
      expect(env.NODE_ENV).toBeUndefined();
    });

    it('should use default BCRYPT_SALT when not set', () => {
      const { env } = require('../../src/config/env');
      expect(env.BCRYPT_SALT).toBe(12);
    });

    it('should use provided BCRYPT_SALT when set', () => {
      process.env.BCRYPT_SALT = '10';
      const { env } = require('../../src/config/env');
      expect(env.BCRYPT_SALT).toBe(10); // แปลงเป็น number
    });

    it('should use default CORS_ORIGIN when not set', () => {
      const { env } = require('../../src/config/env');
      expect(env.CORS_ORIGIN).toEqual(['http://localhost:5173']);
    });

    it('should split CORS_ORIGIN when set with comma-separated values', () => {
      process.env.CORS_ORIGIN = 'http://example.com,http://test.com';
      const { env } = require('../../src/config/env');
      expect(env.CORS_ORIGIN).toEqual(['http://example.com', 'http://test.com']);
    });
  });
});
