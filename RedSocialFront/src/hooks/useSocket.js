import { useEffect } from 'react';
import { connectSocket, getSocket } from '../lib/socket';

export default function useSocket(shouldConnect = true) {
  useEffect(() => {
    if (!shouldConnect) return;
    const s = connectSocket();

    // (Opcional) listeners globales
    const onConnectError = (err) => console.warn('socket connect_error:', err.message);
    s.on('connect_error', onConnectError);

    return () => {
      s.off('connect_error', onConnectError);
    };
  }, [shouldConnect]);

  return getSocket();
}
