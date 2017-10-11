import * as React from 'react';
import { Route, Switch} from 'react-router-dom';
import Layout from './components/Layout/Layout';
import CardsContainer from './components/CardsContainer/CardsContainer';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import isAuthenticated from './components/Auth';

export const routes = 
<Switch>
    <Route path='/login' component={ Login } />
    <Route path='/register' component={ Register } />
    <Layout>
        <Route exact path='/' component={ isAuthenticated(CardsContainer) } />
    </Layout>
</Switch>;
