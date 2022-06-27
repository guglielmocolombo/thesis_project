
import { Col, Button, Row, ProgressBar} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js'
import ComputePrediction from './MyComputePrediction.js';
import CreateModel from './MyCreateModel.js';
import UseOwnModel from './MyUseOwnModel.js';


function MyMain(props) {

  const [file, setFile] = useState('')
  const [signal, setSignal] = useState('')
  const [processing, setProcessing] = useState(false)
  const [ready, setReady] = useState('')
  const [predicted, setPredicted] = useState(false)
  const [prediction, setPrediction] = useState('')
  
  

  return ( <Col className="col-sm-9 below-nav">
            {props.filter==="ComputePrediction" ? <ComputePrediction></ComputePrediction> : props.filter==="TrainaNewPredictor" ?
             <CreateModel></CreateModel> : <UseOwnModel></UseOwnModel>}
          </Col>
  );
}


export default MyMain;