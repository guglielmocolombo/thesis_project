import { Col, Button, Row, ProgressBar, Form} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from './API.js'
import MyFolderContent from './MyFolderContent.js';
import MyIcaComponent from './MyIcaComponent.js';
import MyIcaModal from './MyIcaModal.js';
import { questionMark, complete} from './icons';
import { propTypes } from 'react-bootstrap/esm/Image';


function ComputePrediction(){

    const [fileUploaded, setFileUploaded] = useState(false)
    const [filesi, setFilesi] = useState([])
    const [file, setFile] = useState('')
    const [signal, setSignal] = useState('')
    const [processing, setProcessing] = useState(false)
    const [ready, setReady] = useState('')
    const [predicted, setPredicted] = useState(false)
    const [prediction, setPrediction] = useState('')
    const [ica, setIca] = useState(false)
    const [icaRunning, setIcaRunning] = useState(false)
    const [icaComponents, setIcaComponents] = useState([])
    const [availableModels, setAvailableModels] = useState([])
    const [chosenModels, setChosenModels] = useState([])
    const [percentageCorrectness, setPercentageCorrectness] = useState('')
    const [modalIca, setModalIca] = useState(false);
    const [results, setResults] = useState([]);
    const [modalMessage, setModalMessage] = useState('')

    
    useEffect(() => {
      const retriveAvailableModels = async () => {
          API.availableModels().then(res => setAvailableModels(res) )
      };
      
      retriveAvailableModels();
    }, []);


    const handleSubmit = async (e) => { //EXTRACT THE POWER
        e.preventDefault()
        setPredicted(false)
        setProcessing(true)
    
        if (fileUploaded){
          let signale = await API.processSignal(file, icaComponents)
          //console.log(signale)
          setSignal(signale)
          setReady(true)
          setProcessing(false)
        }
    
      }

    
      const handleFileChange = async (e) => {
        e.preventDefault();
        setReady(false)

        //await API.voidFolder();

        const files = document.getElementById("fileInput");
        const formData = new FormData();
        for (let i = 0; i < files.files.length; i++) {
            formData.append("files", files.files[i]);
            if(files.files[i].name.includes('.vhdr')){
                setFile(files.files[i].name);
            }

        }
        const response = fetch("http://localhost:5000/upload_files", {
            method: 'POST',
            body: formData
        })
        
        if(response){
           setFileUploaded(true);
           setPredicted(false);
        }

      
        /*
        console.log(e.target.files)
        const file = e.target.files
        setFile(file)
        */
      }

      const handleIcaComponents = (nome) => {

        var found = 0
        for (var i = 0; i < icaComponents.length; i++) {
          if (icaComponents[i] === nome) {
            icaComponents.splice(i, 1);
            found = 1
            break;
          }
        }
        if (found === 0)
          setIcaComponents(oldChans => [...oldChans, nome])
    
      }
      
      const computePrediction = async () => {
    

        if(ready && chosenModels.length > 0){
          let result = await API.getPrediction(signal, chosenModels, false);

          console.log(result)
          setResults(result)
          var positive = 0
          var negative = 0
          result.map( r => r.result==='[1]' ? positive++ : negative++)
    
          if(positive>negative){
            setPrediction('PARKINSON\'S disease DETECTED')
            setPercentageCorrectness( (positive/chosenModels.length) *100)
          } else if(positive<negative){
            setPrediction('NO ANOMALIES DETECTED')
            setPercentageCorrectness( (negative/chosenModels.length) *100)
          } else {
            setPrediction('NO PREDICTION CAN BE MADE')
            setPercentageCorrectness( (negative/chosenModels.length) *100)
          }


          //console.log("Per questo segnale predico che è " + dict[result]);
          setPredicted(true)
        }
        else{
          console.log("Aspetta coglionazzo")
          setModalIca(true)
          setModalMessage("problem")
        }
      }

      const icaPreprocessing = async () => {

        setIca(true)
        setIcaRunning(true)
        if(file.length>0){
          await API.icaPreprocessing(file)
          setIcaRunning(false)
        }
      }

      const handleModels = (nome) => {

          var found = 0
          for (var i = 0; i < chosenModels.length; i++) {
            if (chosenModels[i] === nome) {
              chosenModels.splice(i, 1);
              found = 1
              break;
            }
          }
          if (found === 0)
            setChosenModels(oldChans => [...oldChans, nome])
      }

      const cancel = () => {
        setModalIca(false)
      }

    return (
        <Col className="col-sm-9"> 
        {modalIca ? <MyIcaModal cancel={cancel} show={false} message={modalMessage}></MyIcaModal> : 
        <div>
      <Row>
        <h3>Upload the file containing the EEG signals</h3>
        <input type="file" id="fileInput" multiple onChange={handleFileChange}></input>
      </Row>
      <hr></hr>
      <Row>
      <Col>
        <Button id="uploadButton" onClick={icaPreprocessing}>Ica Preprocessing (optional)</Button>
        <Button variant="light" onClick={() => {setModalIca(true); setModalMessage("ICA")}}>{questionMark}</Button>
      </Col>      
      </Row>
      {icaRunning ? 
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="sr-only">Loading...</span>
            </button> : '' }
      {ica ? <MyIcaComponent handleIcaComponents={handleIcaComponents}></MyIcaComponent> : "" }
      <hr></hr>
      <Row>
        <Col className='col-sm-6'> 
          <Button id="uploadButton" onClick={handleSubmit}>Extract Average Total Power</Button> <Button variant="light" onClick={() => {setModalIca(true); setModalMessage("Power")}}>{questionMark}</Button>
          {processing ? 
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span className="sr-only">Loading...</span>
            </button> : ready ? complete : ' ' }
        </Col>
      </Row>
      <hr></hr>
      <Row>
          <h4>Select one or more model to compute the prediction</h4>
          <Form> 
          { availableModels.map( (name, index) => <Form.Check inline type='checkbox' id={index} key={name} label={name} onClick={()=>handleModels(name)}/> )}
          </Form>
      </Row>
      <hr></hr>
      <Row>
        <h4>Compute the prediction, this operation could take some time...</h4>
        <Button variant="success" className="btn btn-lg btn-block" onClick={computePrediction}>Compute Prediction</Button>
      </Row>
        {predicted ? <h4> {prediction}, with an accuracy of {percentageCorrectness}% above the models.</h4>         
        : ''}
        {predicted ? results.map( (m, index) => <h5 key={index} index={index}>The model {m.name} predicted: {m.result === '[1]' ? "Parkinson's disease" : "No disease Detected"}</h5>)
        : ''}
        </div>
    }
    </Col>
  )
}

export default ComputePrediction;