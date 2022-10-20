import { Col, Button, Row, ProgressBar, Form} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js'
import MyIcaModal from './MyIcaModal.js';

function CreateModel(){

    const [file, setFile] = useState('')
    const [signal, setSignal] = useState('')
    const [training, setTraining] = useState(false)
    const [modal, setModal] = useState(false)
    const [modalMessage, setModalMessage] = ('')
    const [ready, setReady] = useState('')
    const [predicted, setPredicted] = useState(false)
    const [prediction, setPrediction] = useState('')
    const [algorithms, setAlgorithms] = useState([])
    const [channels, setChannels] = useState([])
    const [modelName, setModelName] = useState('')
    const [selectedAll, setSelectedAll] = useState(false)
    const [description, setModelDescription] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        API.voidFolder();
    
      }
    
    const handlePatients = (e) => {
        e.preventDefault();

        const files = document.getElementById("files_patients");
        const formData = new FormData();
        for (let i = 0; i < files.files.length; i++) {
            console.log(files.files[i])
            formData.append("files", files.files[i]);
        }
        fetch("http://localhost:5000/upload_patients", {
            method: 'POST',
            body: formData
        })
            .then((res) => console.log(res))
        .catch((err) => ("Error occured "+ err));
        
      }

      const handleControls = (e) => {
        e.preventDefault();

        const files = document.getElementById("files_controls");
        const formData = new FormData();
        for (let i = 0; i < files.files.length; i++) {
            console.log(files.files[i])
            formData.append("files", files.files[i]);
        }
        fetch("http://localhost:5000/upload_controls", {
            method: 'POST',
            body: formData
        })
            .then((res) => console.log(res))
        .catch((err) => ("Error occured "+ err));
      
      }
      
      const computeTraining = async () => {
    
        
        if(algorithms.length===0 || channels.length===0){
            console.log("E allora fai quello che ti pare")
        } else{
          let result = await API.trainModel(algorithms, channels, modelName);
        }
        
        setTraining(false)
      }

  const handleAlgorithm = (nome) => {

    var found = 0
    for (var i = 0; i < algorithms.length; i++) {
      if (algorithms[i] === nome) {
        algorithms.splice(i, 1);
        found = 1
        break;
      }
    }
    if (found === 0)
      setAlgorithms(oldAlg => [...oldAlg, nome])

  }

  const handleChannel = (nome) => {
    var found = 0
    for (var i = 0; i < channels.length; i++) {
      if (channels[i] === nome) {
        let appo = channels
        appo.splice(i, 1)
        setChannels(appo)
        found = 1
        break;
      }
    }
    if (found === 0)
      setChannels(oldChans => [...oldChans, nome])
  }

  const selectAll = () => {

    if(!selectedAll){
      setChannels(['Fp1','Fz', 'F3','F7','Iz','FC5','FC1','C3','T7', 'TP9','CP5','CP1','P3','P7', 'O1', 'Oz','O2','P4','P8','TP10', 'CP6','CP2','Cz','C4','T8','FT10',
      'FC6','FC2','F4','F8','Fp2','AF7','AF3','AFz','F1','F5','FT7','FC3','C1','C5','TP7','CP3','P1','P5','PO7','I1', 'POz','I2','PO8','P6','P2','CPz','CP4','TP8', 'C6','C2','FC4','FT8','F6','AF8','AF4','F2','FCz'])
      setSelectedAll(true)
    } else {
      setChannels([])
      setSelectedAll(false)
    }
  }


    return (
        <Col className="col-sm-9">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Insert the name of the model</Form.Label>
            <Form.Control type="email" placeholder="alcoholism_brugmann_2018" onChange={e => setModelName(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label onChange={e => setModelDescription(e.target.value)}>Insert a short description of the model</Form.Label>
            <Form.Control as="textarea" rows={2} />
          </Form.Group>
        </Form>
      <Row>
        <Col>
          <h3>Uplaod the patients files</h3>
          <input type="file" id="files_patients" multiple="multiple" onChange={handlePatients}></input>
        </Col>
        <Col>
          <h3>Uplaod the controls files</h3>
          <input type="file" id="files_controls" multiple="multiple" onChange={handleControls}></input>
        </Col>
      </Row>
      <hr></hr>
      <Row>
        <Col>
          <h4>Select the Channels to consider</h4> 
        </Col>
        <Col>
          <button type="button" className="btn btn-primary btn-sm" onClick={selectAll}>Select All</button>
        </Col>
      <Form>
      {['Fp1','Fz', 'F3','F7','Iz','FC5','FC1','C3','T7', 'TP9','CP5','CP1','P3','P7', 'O1', 'Oz','O2','P4','P8','TP10', 'CP6','CP2','Cz','C4','T8','FT10',
      'FC6','FC2','F4','F8','Fp2','AF7','AF3','AFz','F1','F5','FT7','FC3','C1','C5','TP7','CP3','P1','P5','PO7','I1', 'POz','I2','PO8','P6','P2','CPz','CP4','TP8', 'C6','C2','FC4','FT8','F6','AF8','AF4','F2','FCz'].map( (name, index) => <Form.Check type='checkbox' checked={channels.includes(name)} id={index} key={name} label={name} inline onChange={()=>handleChannel(name)}/> ) }
      </Form>
      <hr></hr>
      <h4>Select the Machine Learning algorithms to train</h4> 
      <Row>
      <Form> 
        { ['Logistic Regression', 'Random Forest Classifier', 'K-Nearest Neighbors', 'Support Vector Machine', 'Linear Discriminant Analysis'].map( (name, index) => <Form.Check type='checkbox' id={index} key={name} label={name} onClick={()=>handleAlgorithm(name)}/> )}
        </Form>
        </Row>
        <hr></hr>
      </Row>
      <Row>
        <h4>Train a new Machine Learning Model... the operation could take some time</h4>
        {training ? 
            <button className="btn btn-success" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="sr-only">Training of the model ongoing</span>
            </button> : <Button variant="success" className="btn btn-lg btn-block" onClick={() => {setTraining(true); computeTraining()}}>Train the Model</Button> }
      </Row>
    </Col>
    )
}

export default CreateModel;