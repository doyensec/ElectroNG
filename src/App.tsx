import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { DashboardView } from './modules/Dashboard';
import routes from './constants/routes.json';
import { NewProjectView, SplashscreenView } from './modules/Welcome/views';
import './App.global.css';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={routes.SPLASHSCREEN} component={SplashscreenView} />
        <Route exact path={routes.NEW_PROJECT} component={NewProjectView} />
        <Route
          path={`${routes.DASHBOARD}/:projectId`}
          component={DashboardView}
        />
      </Switch>
    </Router>
  );
}
