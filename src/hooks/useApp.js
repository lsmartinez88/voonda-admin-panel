import { AppContext } from '@/components/AppProvider/AppContext';
import { useContext } from 'react';

export function useApp() {
  return useContext(AppContext);
}
