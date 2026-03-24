import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import Dashboard from './pages/Dashboard';
import EditApplication from './pages/EditApplication';
import Auth from './utils/auth';

const httpLink = createHttpLink({
  uri: '/graphql',
});


const authLink = setContext((_, { headers }) => {
  const token = Auth.getToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className="display-2">Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/applications/:applicationId',
        element: <EditApplication />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);