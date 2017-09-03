import * as React from 'react';
import { Route, Switch} from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import Login from './components/Login';
import isAuthenticated from './components/Auth';

export const routes = 
<Switch>
    <Route path='/login' component={ Login } />
    <Layout>
        <Route exact path='/' component={ isAuthenticated(Home) } />
        <Route path='/counter' component={ isAuthenticated(Counter) } />
        <Route path='/fetchdata/:startDateIndex?' component={ isAuthenticated(FetchData) } />
    </Layout>
</Switch>;
