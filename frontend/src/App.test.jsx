import { render } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';

// Mock do axios
vi.mock('axios');

test('renders app without crashing', () => {
  render(<App />);
});
