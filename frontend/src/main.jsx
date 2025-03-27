import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import es_ES from 'antd/locale/es_ES'; // Importa el idioma español
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
import App from './App.jsx'
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>    
      <ConfigProvider locale={es_ES} theme={{token: {colorPrimary:'#812323'}}}>
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
)
