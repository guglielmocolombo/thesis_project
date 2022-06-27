import API from './API.js'
import { useState, useEffect} from 'react';
import { Form, Button } from 'react-bootstrap';


function MyIcaComponent(props){

    

    return(
        <div>
            <h4>Select the Ica components to exclude from the signals, if any... wait for the computation to conclude</h4>
            <Form>
                {['ICA000', 'ICA001', 'ICA002', 'ICA003', 'ICA004', 'ICA005', 'ICA006', 'ICA007', 'ICA008', 'ICA009'].map( (name, index) => <Form.Check type='checkbox' id={index} key={name} label={name} inline onClick={()=>props.handleIcaComponents(name)}/> ) }
            </Form>
        </div>

    );

}

export default MyIcaComponent;