import {ListGroup, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { useState } from 'react';

const filters = ['Compute Prediction', 'Train a New Predictor', 'Use Your Own Built Model'];

function MyFilterItem(props){
    let ref = "/" + props.filter.replaceAll(" ", "").trim();
    if(props.selected)
        return <Link to={ref}><ListGroup.Item action active >{props.filter}</ListGroup.Item></Link>
    else
        return <Link to={ref}><ListGroup.Item action onClick={() => {props.chooseFilter(props.index);}}>{props.filter}</ListGroup.Item></Link>
}

function MyFiltersListGroup(props){
    return (<>
        <ListGroup variant="flush">
        {filters.map( (filter, index) => <MyFilterItem filter={filter} key={index} index={index} selected={index === props.numberfilter} setDirty={props.setDirty} chooseFilter={props.chooseFilter}>  </MyFilterItem>)}
        </ListGroup>
    </>);
}

function MySidebar(props){
    
    let numberfilter;
    switch(props.url){
        case "Train a New Predictor":
            numberfilter = 2;
        break;
        case "Use Your Own Built Model":
            numberfilter = 1;
        break;
        default:
            numberfilter = 0;
        break;
    }

    
    const [filter, setFilter] = useState(numberfilter);
    const chooseFilter = (index) => {
        setFilter(index);
        props.setReady(true);
    };
    
    return (
        <Col className="col-sm-3 bg-light below-nav" id="left-sidebar">
            <MyFiltersListGroup chooseFilter={chooseFilter} numberfilter={filter}></MyFiltersListGroup>
        </Col>
    );
}

export { MySidebar, filters };