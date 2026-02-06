import { render } from '@testing-library/react';
import App from './App';

// Mock do axios
jest.mock('axios');

test('renders app without crashing', () => {
  render(<App />);
});