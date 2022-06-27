import { ProgressBar} from 'react-bootstrap';
import { useState } from 'react';

function MyProgressBar() {
 const [progressNow, setProgressNow] = useState(0)

 const updateProgressNowHandler = setInterval(() => {
  if (progressNow >= 70 ){
   setProgressNow(70)
   clearInterval(updateProgressNowHandler)
  }
  setProgressNow(s => s+1)
 }, 50)

 return (
       <ProgressBar animated now='70' className="progress-bar"/> 
     );
}

export default MyProgressBar;