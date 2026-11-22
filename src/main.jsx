import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createRouter,
  createMemoryHistory,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import CookieBanner from './components/CookieBanner';
import './index.css';

const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
});

const router = createRouter({
  routeTree,
  history: memoryHistory,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <CookieBanner />
  </React.StrictMode>
);