import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import './styles/index.css';
import { HMSRoomProvider } from "@100mslive/react-sdk";

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
    path: "/video",
    element: <Layout />
  },
  {
    path: "/",
    element: <Layout />
  },
  {
    path: "/create-class",
    element: <Layout />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HMSRoomProvider>
      <RouterProvider router={router} />
    </HMSRoomProvider>
  </React.StrictMode>,
);
