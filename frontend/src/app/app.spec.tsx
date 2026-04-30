import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

const mockFetch = jest.fn();

describe('App', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    (global as unknown as { fetch: typeof fetch }).fetch =
      mockFetch as unknown as typeof fetch;
    mockFetch.mockImplementation((url: string) => {
      if (url.endsWith('/api/health')) {
        return Promise.resolve({
          json: () => Promise.resolve({ model_status: 'ready' }),
        });
      }
      if (url.endsWith('/api/patients')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                id: 'mit-test-001',
                source: 'mit_test.csv',
                row_index: 0,
                label: 0,
                sample_count: 187,
              },
            ]),
        });
      }
      if (url.endsWith('/api/reference-signals')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                id: 'mit-class-1',
                label: 1,
                name: 'Supraventricular ectopic beat',
                dataset: 'MIT',
                kind: 'abnormal',
                source_count: 12,
                signal: [0, 0.3, 0.7, 0.2, 0.1, 0],
              },
            ]),
        });
      }
      if (url.endsWith('/api/patients/mit-test-001')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              id: 'mit-test-001',
              source: 'mit_test.csv',
              row_index: 0,
              label: 0,
              sample_count: 187,
              signal: [0, 0.2, 0.9, 0.3, 0.1, 0],
              normal_template: [0, 0.1, 0.8, 0.2, 0.1, 0],
              metrics: {
                sample_count: 187,
                sample_rate_hz: 125,
                duration_seconds: 1.5,
                peak_count: 1,
                estimated_bpm: 67,
                mean_amplitude: 0.2,
                min_amplitude: 0,
                max_amplitude: 0.9,
                amplitude_range: 0.9,
                mean_rr_ms: 0,
                peak_indexes: [2],
                peak_values: [0.9],
              },
            }),
        });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });
  });

  it('renders the clinical workbench', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText('Experimental ECG Signal Explorer')).toBeTruthy();
    expect(await screen.findByText('mit-test-001')).toBeTruthy();
    expect(await screen.findByText('67 bpm')).toBeTruthy();
  });
});
