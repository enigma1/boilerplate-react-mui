import '^/globals.js';
import {Helmet} from "react-helmet";
import {ThemeProvider} from '@mui/material/styles'
import dataContext, {CStrings, Cfg} from '=/dataContext'
import webTheme from '=/webTheme'
import App from '^/App.js';

const Main = () => {
  if('serviceWorker' in navigator) {
    console.log('Notice: service-worker supported');
  }

  return(<>
    <Helmet>
      <base href="/" />
      <meta charSet="utf-8" />
      <title>Boilerplate with ReactJS/MUI/Webpack</title>
      <meta name="description" content="Boilerplate/Seed Test/Demo" />
    </Helmet>
    <CStrings.Provider value={dataContext.strings.default}>
      <Cfg.Provider value={dataContext.configData.default}>
        <ThemeProvider theme={webTheme}>
          <App />
        </ThemeProvider>
      </Cfg.Provider>
    </CStrings.Provider>
  </>)
};

ReactDOM.render(Main(), document.getElementById('root'));
