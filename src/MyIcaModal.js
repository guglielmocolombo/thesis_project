import { Modal, Button } from 'react-bootstrap';

function MyIcaModal(props) {
return(
  <Modal show={true} size="md" aria-labelledby="example-modal-sizes-title-lg" onHide={props.cancel} >
  <Modal.Header style={{ backgroundColor: "#5db3e6"}}>
      <Modal.Title style={{ fontSize: "25px"}}> {"Indipendent Component Analysis"} </Modal.Title>
  </Modal.Header>
  <Modal.Body >
    {props.message === "ICA" ? "Independent Component Analysis is a method to separate Independent Components from the actual components to separate more easily the noise artifacts." 
        : props.message==="Power" ? "The total power is computed using the Welch's method for the FastFourierTransform" : " Before computing the prediction, EXTRACT THE TOTAL POWER FROM THE SIGNAL AND SELECT AT LEAST ONE MODEL"}
    
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={props.cancel}> Cancel </Button>
  </Modal.Footer>
</Modal> );

}

export default MyIcaModal;