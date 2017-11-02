import * as React from 'react';
import { Route, Switch} from 'react-router-dom';
import OuterLayout from './components/OuterLayout/OuterLayout';
import Layout from './components/Layout/Layout';
import CardsContainer from './components/CardsContainer/CardsContainer';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import isAuthenticated from './components/Auth/Auth';
import NoMatch from './components/ErrorPages/NoMatch';
import EmailSuccess from './components/ErrorPages/EmailSuccess';
import EmailFailure from './components/ErrorPages/EmailFailure';
import ResendEmail from './components/ResendEmail/ResendEmail';

export const routes = 
<OuterLayout>
    <Switch>
        <Route path='/login' component={ Login } />
        <Route path='/register' component={ Register } />
        <Route path='/email/success' component={ EmailSuccess } />
        <Route path='/email/failure' component={ EmailFailure } />
        <Route path='/resendemail' component={ ResendEmail } />
        {/* <Route component={ NoMatch }/> */}
        <Layout>
            <Route exact path='/' component={ isAuthenticated(CardsContainer) } />
        </Layout>
    </Switch>
</OuterLayout>
