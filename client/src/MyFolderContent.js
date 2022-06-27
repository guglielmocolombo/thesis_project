import API from './API.js'
import { useState, useEffect} from 'react';
import { Form, Button } from 'react-bootstrap';


function MyFolderContent(props){

    const [folder, setFolder] = useState([])
    const [toDelete, setToDelete] = useState([])

    const deleteFile = () =>{

        API.deleteFiles(toDelete);

    }
    

    return(

    <div key='default-checkbox' className="mb-3">
        <Button variant="warning">Delete Selected</Button>

        {props.filesi.map( (file, index) => <Form.Check type='checkbox' key={index} id={index} label={file} onChange={setToDelete([...toDelete, file])}/> )}
      
    </div>

    );

}

export default MyFolderContent;