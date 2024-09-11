// components/AppProviders.jsx
'use client';

import { SessionProvider } from "next-auth/react";
import { BookmarkProvider } from '../contexts/BookmarkContext';
// Import other providers as needed

import { composeProviders } from '../utils/composeProviders';

const providers = [
  SessionProvider,
  BookmarkProvider,
  // Add other providers here
];

const ComposedProviders = composeProviders(...providers);

const AppProviders = ({ children, session }) => (
  <ComposedProviders session={session}>
    {children}
  </ComposedProviders>
);

export default AppProviders;