import React from "react";
import './Section.css';

export interface SectionProps {
    title: string;
    renderToolbar?: () => JSX.Element;
}

interface SectionState {
}

export default class Section extends React.Component<SectionProps, SectionState> {
    renderToolbar() {
        if (!this.props.renderToolbar) {
            return;
        }
        return this.props.renderToolbar();
    }

    render() {
        return <div className="Section">
            <div className="Section-header">
                <div className="Section-title">{this.props.title}</div>
                <div>{this.renderToolbar()}</div>
            </div>
            <div className="Section-body">
                {this.props.children}
            </div>
        </div>;
    }
}
