import '^/globals.js';
import {useState, useEffect} from 'react';
import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import Meta from '%/Common/Meta'
import dataContext, {GlobalConfig} from '=/dataContext'
import webTheme from '=/webTheme'
import {serviceImporter} from '!/useHandlers';
import App from '^/App';

const cStrings = {
  "helmetTitle": "Boilerplate with ReactJS/MUI/Webpack",
  "helmetMetaDescription": "Boilerplate/Seed Test/Demo"
};

const Startup = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    serviceImporter().then( (data) => {
      Object.entries(data).forEach( entry => {
        const [,service] = Object.entries(entry)[1];
        if(service.initialize && typeof service.initialize === 'function' ) {
          service.initialize();
        }
      });
      setReady(true);
    });
  },[])

  return(<>{ready &&
    <GlobalConfig.Provider value={dataContext}>
      <MuiThemeProvider theme={webTheme}>
        <App />
      </MuiThemeProvider>
  </GlobalConfig.Provider>
  }</>);
}

const Main = () => {
  if('serviceWorker' in navigator) {
    console.log('Notice: service-worker supported');
  }

  return(<>
    <Meta title={cStrings.helmetTitle} description={cStrings.helmetMetaDescription} />
    <Startup />
  </>)
};

ReactDOM.render(Main(), document.getElementById('root'));
