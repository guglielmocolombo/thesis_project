import {Navbar, Nav} from 'react-bootstrap';
import { iconLogo} from './icons';

function MyNavbar(props){
    return (
      <Navbar className="color-bar" bg="primary" variant="light" fixed='top' expand='sm'>
      
      <Nav className="container-fluid">
      
        <Nav.Item>
          <Navbar.Brand className="margin-logo" style={{textShadow: "2px 2px green", fontSize: "30px"}}>{iconLogo} EEGPredictor {iconLogo}</Navbar.Brand>
        </Nav.Item>        

      </Nav>
    </Navbar>
    );
}

export default MyNavbar;