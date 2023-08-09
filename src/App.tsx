import { Home } from 'pages';
import { CurrencyProvider } from 'contexts/currency.tsx';

function App() {
  return (
    <CurrencyProvider>
      <Home />
    </CurrencyProvider>
  );
}

export default App;
