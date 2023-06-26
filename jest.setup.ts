// jest.setup.ts
import '@testing-library/jest-dom';
import 'jest-fetch-mock';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));
