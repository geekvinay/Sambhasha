import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import './styles/index.css';

const router = createBrowserRouter([
  {
    path: "/teacher",
    element: <Layout />
  },
  {
    path: "/student",
    element: <Layout />
  },
  {
    path: "/",
    element: <Layout />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
