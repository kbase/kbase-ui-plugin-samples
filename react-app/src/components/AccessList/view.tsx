import React from "react";
import UserCard from "../UserCard/view";
import "./style.css";
import { ACL, User } from "../../lib/ViewModel/ViewModel";
import { Section } from "@kbase/ui-components";
import { Span } from "lib/instrumentation/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faUserLock } from "@fortawesome/free-solid-svg-icons";

export interface AccessListProps {
  acl: ACL;
  owner: User;
}

interface AccessListState {}

export default class DataLinks extends React.Component<
  AccessListProps,
  AccessListState
> {
  span: Span;
  constructor(props: AccessListProps) {
    // super({ ...props, name: 'Component.DataLinks' });
    super(props);
    this.span = new Span({ name: "Component.DataLinks" }).begin();
  }
  componentWillUnmount() {
    this.span.end();
  }
  renderACL(aclPart: Array<User>) {
    if (aclPart.length === 0) {
      return (
        <p style={{ fontStyle: "italic" }}>No users with this access level</p>
      );
    }
    return aclPart
      .sort((a: User, b: User) => {
        return a.username.localeCompare(b.username);
      })
      .map((user) => {
        return <UserCard user={user} key={user.username} />;
      });
  }

  renderPublicPrivate(acl: ACL) {
    if (acl.isPublic) {
      return (
        <div className="PublicPrivateMessage">
          <FontAwesomeIcon icon={faGlobe} size={"2x"} />
          <span className="-message">
            This sample is <b>Public</b>. It may be accessed by the KBase users
            listed below and viewed by anyone with the link, without being
            logged into KBase.
          </span>
        </div>
      );
    }
    return (
      <div className="PublicPrivateMessage">
        <FontAwesomeIcon icon={faUserLock} size={"2x"} />
        <span className="-message">
          This sample is <b>Private</b>, it may only be accessed by KBase users
          listed below.
        </span>
      </div>
    );
  }

  render() {
    return (
      <div className="AccessList" data-testid="accesslist">
        <div className="Row" style={{ marginBottom: "1em" }}>
          <div className="Col -stretch">
            <div className="LabeledInfo">
              <div className="-label">Sample Access</div>
              <div className="-info">
                {this.renderPublicPrivate(this.props.acl)}
              </div>
            </div>
          </div>
        </div>
        <div className="Row -stretch">
          <div className="Col -stretch" style={{ marginRight: "10px" }}>
            <Section title="Owner">
              <div className="Col -stretch -autoscroll">
                <UserCard user={this.props.owner} key="owner" />
              </div>
            </Section>
          </div>
          <div className="Col -stretch" style={{ marginRight: "10px" }}>
            <Section title="Admin Access">
              <div className="Col -stretch -autoscroll">
                {this.renderACL(this.props.acl.admin)}
              </div>
            </Section>
          </div>
          <div
            className="Col -stretch"
            style={{ marginLeft: "5px", marginRight: "5px" }}
          >
            <Section title="Write Access">
              <div className="Col -stretch -autoscroll">
                {this.renderACL(this.props.acl.write)}
              </div>
            </Section>
          </div>
          <div className="Col -stretch" style={{ marginLeft: "10px" }}>
            <Section title="Read-Only Access">
              <div className="Col -stretch -autoscroll">
                {this.renderACL(this.props.acl.read)}
              </div>
            </Section>
          </div>
        </div>
      </div>
    );
  }
}
