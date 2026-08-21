import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom)[\\/]/,
              priority: 30
            },
            {
              name: 'chakra',
              test: /node_modules[\\/](@chakra-ui|@ark-ui|@emotion|@zag-js)[\\/]/,
              priority: 20
            },
            {
              name: 'recharts',
              test: /node_modules[\\/]recharts[\\/]/,
              priority: 20
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10
            }
          ]
        }
      }
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  }
});
