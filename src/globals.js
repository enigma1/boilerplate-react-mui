import PubSub from 'pubsub-js';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

//import dbRules from '^/Config/dbRules';
import pouchdbFind from 'pouchdb-find';
PouchDB.plugin(pouchdbFind);

//window.React = React;
//window.ReactDOM = ReactDOM;
global.React = React;
global.ReactDOM = ReactDOM;
global.PropTypes = PropTypes;

//global.localDB = new PouchDB('testcollection');

//localDB.plugin(pouchFind);

// localDB.info().then(info => {
//   console.log('db', info)
// });

// localDB.put(dbRules[1]).then(result => {
//   console.log('rules entered', result);
// })
//2:"{"table_id":4,"title":"Test Note","desc":"test nnte description","_doc_id_rev":"4-e8tq96d9ssy7::1-774c9e92ed220b8ff78f1361af079772"}"



// localDB.getIndexes(function (e, result) {
//   console.log('ttttt', result, e);
//   // handle result
// });


// localDB.query('notes/listing', {
//   //view: 'listing/myview',
//   //key: '4-upol5pqm3k75::1-c3648dd16ac7828f78f71d135ba70627"',
//   include_docs: true
// }, function(e, result) {
//   console.log('out', result, e);
// })