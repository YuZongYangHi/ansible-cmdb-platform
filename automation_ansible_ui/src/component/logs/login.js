import React from 'react';
import Logsearch from '../../utils/loginput';
class Loginlog extends React.Component {

   render() {
       return (
           <div>
           <Logsearch async={'login'} res={true} control={true} />
           </div>
       )
   }
}

export default Loginlog