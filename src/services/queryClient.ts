import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0
    },
    mutations: {
      retry: 0
    }
  }
});
