## Boilerplate/skeleton with ReactJS Material UI and Webpack

Startup javascript code using ReactJS Material UI and Webpack

Startup code with the following main libraries:
[React JS](http://facebook.github.io/react/)
[Material UI](https://github.com/mui-org/material-ui)
[![LICENSE](https://img.shields.io/badge/license--lightgrey.svg)](https://github.com/https://github.com/enigma1/boilerplate-react-mui/blob/master/LICENSE.txt)

##### This boilerplate includes
 - Supports nested routing and lazy loading of route components
 - Provides content and configuration for components with the aid of simple function hooks

### Brief description of folders use in the tree

The pages folder holds the basic html and main components
Individual sections can be found in the the Modules folder
The Services folder is utilized by each component via a custom reducer
Arbitrary Communication among components can be established with the standard react read properties or context or an external global library in few cases for specific subscriptions. State management is customized see the state management section below

#### Fixed Parameters

- dataContext.js - access to strings and overall configuration
- params.json - component/module based static parameters
- strings.json - component/module based strings and string templates
- routes.json - routing configuration
- webTheme.js - theme customization file used with the MUI provider

#### Core

- folder to use for custom Reactjs hooks
- useServices.js state and services support code. Provides the means to separate logic from layout in components
- useHandlers.js state and service handling for comonents. Keeps track of active services, provide handlers and a default state reducer. This is the main part of state management.

#### Modules

- Common Folder - All common modules used by components and modules like header and footer
- Other Folders - Page-based naming component associated folders. Components of each page appear in a folder here.
- Counter - Sample Counter Module with controls
- Timer - Multi Timer component demonstrating separation of control logic from the visual aspects of the module

#### Pages

- Individual Page Components

#### Root Files
- index.js - Entry point file
- index.html - Only used to attach the reactjs app on a root element
- globals.js - sets up react as global to minimize bloat
- App.js - Root component for the reactjs app sets up routing and component lazy loading

#### webpack

- Bundler configuration files for development and production
- Output files are set in development and production sub-folders inside the webpack folder

### assets

- Media based resource files

### Other Info

- babel.config.js uses relative path definitions to simplify path resolving
- To simplify component properties I used one of the libraries for styling. In this case emotion/react. This is also used with the more recent versions of MUI
- Complex components use a folder structure which consists of the index.js that holds the view/layout, controller.js that holds the component logic, strings.json providing associated strings and styling.js providing style and inline property spreading for components.
