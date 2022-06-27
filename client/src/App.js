import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import MyNavbar from './MyNavbar';
import MyMain from './MyMain';
import {Container, Row} from 'react-bootstrap';
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {MySidebar} from './MySidebar';
import API from './API';

function App(){
  const [ready, setReady] = useState(false);

  /*
  useEffect(() => {
    const retriveContent = async () => {
        API.voidFolder();
    };
    
    console.log("Cancella tutto")
    retriveContent();
  }, []);
  */

  return (
    <Router>
      <Switch>
        <Route path="/:filter" render={({ match }) =>
          <>
            <Container fluid>
              <MyNavbar></MyNavbar>
              <Container fluid>
                <Row className="vheight-100">
                <MySidebar url={match.params.filter} setReady={setReady} ></MySidebar>
                  <MyMain filter={match.params.filter} ready={ready} setReady={setReady}> </MyMain>
                </Row>
              </Container>
            </Container>
          </> 
        }></Route>
        <Route path="/" render={() =>
            <Redirect to="/ComputePrediction" ></Redirect>
        } />
      </Switch>
    </Router>
  );
}

export default App;
