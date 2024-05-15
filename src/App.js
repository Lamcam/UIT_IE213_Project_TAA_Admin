import {
  Route,
  Router,
  Routes,
  RouterProvider,
  createBrowserRouter,
  BrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Fragment } from 'react';
import AdminRootLayout from 'routers/AdminRootLayout';
import Dashboard from 'pages/Dashboard';
import News from 'pages/News';
import Products from 'pages/Products';
import Account from 'pages/Account';
import Order from 'pages/Order';
import Login from 'pages/Login';
import PrivateRoutes from 'ultils/PrivateRoutes';
const router = createBrowserRouter(
  createRoutesFromElements(
    // <Route path="/" element={<AdminRootLayout></AdminRootLayout>}>
    //   <Route index element={<Dashboard />} />
    //   <Route path="dashboard" element={<Dashboard />} />
    //   <Route path="news" element={<News />} />
    //   <Route path="products" element={<Products />} />
    //   <Route path="accounts" element={<Account />} />
    //   <Route path="order" element={<Order />} />
    // </Route>,

    <Route path="/">
    <Route index element={<Login />} />
    <Route element={<PrivateRoutes></PrivateRoutes>}>
        <Route element={<AdminRootLayout />} >
          <Route index element={<Dashboard />} />
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="news" element={<News />} />
          <Route path="products" element={<Products />} />
          <Route path="accounts" element={<Account />} />
          <Route path="order" element={<Order />} />
        </Route>
      </Route>
    </Route>,
    // <Routes>
    //     <Route element={<PrivateRoutes />}>
    //       <Route element={<Order/>} path="/" exact/>
    //       <Route element={<Products/>} path="/products"/>
    //     </Route>
    //     <Route element={<Login/>} path="/"/>
    // </Routes>
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
