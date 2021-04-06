import React from 'react';
import { RouteComponentProps } from "react-router-dom";

export type AboutProps = RouteComponentProps;


// export default class About extends React.Component<AboutProps, {}> {
//     render() {
//         return <div>
//             <p>About the samples Plugin...</p>
//         </div>;
//     }
// }

const About: React.FC<AboutProps> = (props: AboutProps) => {
    return <div>
        <p>About the samples Plugin...</p>
    </div>;
}

export default About;
