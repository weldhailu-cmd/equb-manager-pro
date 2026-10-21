import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// ቋንቋውን የሚያስተናብረው ኮንቴክስት ፕሮቫይደር (በፕሮጀክትዎ መዋቅር መሰረት ዱካውን ትክክል መሆኑን ያረጋግጡ)
import { LanguageProvider } from './context/LanguageContext';

// QueryClient Instance መፍጠር
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // ገጽ በሚቀየርበት ጊዜ አላስፈላጊ API request እንዳይበዛ
      retry: 1,                    // ጥሪ ቢቋረጥ አንድ ጊዜ ብቻ ደግሞ ይሞክራል
      staleTime: 1000 * 60 * 5,    // ለ 5 ደቂቃ ዳታውን Cache አድርጎ ይይዛል
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);