import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOffline(false);
    const goOffline = () => setOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'OFFLINE_CONTENT') {
        setOffline(true);
      }
    });

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="bg-yellow-400 text-black text-center py-1 text-sm">
      Anda sedang offline - konten mungkin berasal dari cache.
    </div>
  );
}
