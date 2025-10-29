import { AuthContext } from '@/components/AuthProvider/AuthContext';
import React from 'react';

export function useAuth() {
  return React.useContext(AuthContext);
}
