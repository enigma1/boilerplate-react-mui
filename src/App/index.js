import {useState, lazy, Suspense} from 'react';
import {Routes, BrowserRouter as Router} from 'react-router-dom';
import {useRouting} from '!/useServices';
import {componentDefaults} from "./settings";
import cStrings from './strings.json'

const importer = ({component}) => lazy(() => import(`^/Pages/${component}`));
const AllRoutes = ({routes}) => <Routes>{routes}</Routes>

const App = ({routesTree}) => {
  const [routes, setRoutes] = useState([]);
  useRouting(setRoutes, {routes:routesTree}, importer);
  return(<>
    <Router forceRefresh={true} keyLength={24}>
      <Suspense fallback={cStrings.fallback}>
        <AllRoutes routes={routes} />
      </Suspense>
    </Router>
  </>);
}

App.defaultProps = componentDefaults;

export default App;
