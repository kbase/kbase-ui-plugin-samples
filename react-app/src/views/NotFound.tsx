import React from 'react';
import { RouteComponentProps } from "react-router-dom";


// export default class Help extends React.Component<RouteComponentProps, {}> {
//     render() {
//         return <div>
//             <p>Help!</p>
//         </div>;
//     }
// }

export type NotFoundProps = RouteComponentProps;


const NotFound: React.FC<NotFoundProps> = (props: NotFoundProps) => {
    console.log('props', props);
    return <div>
        <p>NOT FOUND!</p>
        <p>{props.location.pathname}</p>
    </div>;
}

export default NotFound;
