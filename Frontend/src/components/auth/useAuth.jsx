import { useContext } from 'react';
import { AuthContext } from './authContextDefinition.js';

export const useAuth = () => useContext(AuthContext);
