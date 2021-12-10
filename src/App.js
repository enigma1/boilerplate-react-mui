import {useState, useEffect, lazy, Suspense} from 'react';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import * as routerData from "=/routes.json";

const cStrings = {
  "fallback": "Loading Page..."
};


const importer = ({component}) => lazy(() => import(`^/Pages/${component}`));

const AllRoutes = ({routes}) => <Routes>{routes}</Routes>

const App = ({name}) => {
  const [routes, setRoutes] = useState([]);

  const promisedRoutes = ({routes}) => routes.map((entry, idx) => {
    const props = {...entry, component:importer(entry)};
    const Component = props.component;
    return(
      <Route path={props.path} element={<Component />} key={[idx, entry.path].join('-')}>
        {entry.children && promisedRoutes({routes: entry.children})}
      </Route>
    );
  });

  const setupRouting = async () => {
    const routes = await Promise.all(promisedRoutes(routerData.default))
    setRoutes(routes);
  };

  useEffect(() => setupRouting(),[]);

  return(
    <Router>
      <Suspense fallback={cStrings.fallback}>
        <AllRoutes routes={routes} />
      </Suspense>
    </Router>
  );
}

App.defaultProps = {
  name: App.name,
};

export default App;
