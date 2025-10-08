import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css'
import './assets/css/custom.scss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import es_ES from 'antd/locale/es_ES'; // Importa el idioma español
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
import App from './App.jsx'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5* 60 * 1000, // 5 minutos hasta que los datos se consideren obsoletos
      cacheTime: 15 * 60 * 1000, // 15 minutos en caché
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>    
      <ConfigProvider locale={es_ES} theme={{token: {colorPrimary:'#812323'}}}>
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
)
