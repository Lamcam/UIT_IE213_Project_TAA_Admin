import {
  Route,
  Router,
  Routes,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Fragment } from 'react';
import AdminRootLayout from 'routers/AdminRootLayout';
import Dashboard from 'pages/Dashboard';
import News from 'pages/News';
import Products from 'pages/Products';
import Account from 'pages/Account';
import Order from 'pages/Order';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AdminRootLayout></AdminRootLayout>}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="news" element={<News />} />
      <Route path="products" element={<Products />} />
      <Route path="accounts" element={<Account />} />
      <Route path="order" element={<Order />} />
    </Route>,
  ),
);

function App() {
  return (
    <Fragment>
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
