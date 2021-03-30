import { Dispatch } from "react";
import { Action } from "redux";
import { connect } from "react-redux";
import { navigate, RootState } from "@kbase/ui-components";
import { Navigation } from "@kbase/ui-components/lib/redux/integration/store";

// TODO: remove!
import { StoreState } from "../../redux/store";

// Local imports
import View from "./view";
import { RouteSpec } from "./RouteSpec";

export interface RoutePath {
  type: string;
  name: string;
  optional?: boolean;
}

export interface RouteParams {
  plugin?: string;
}

export interface Route {
  path: Array<RoutePath | string>;
  view: string;
  authorization: boolean;
  params: RouteParams;
}

interface OwnProps {
  routes: Array<RouteSpec>;
  // TODO: this should not be necessary!
  children?: React.ReactNode;
}

interface StateProps {
  rootState: RootState;
  trigger: number;
  navigation: Navigation;
  routes: Array<RouteSpec>;
}

interface DispatchProps {
  navigate: (nav: Navigation) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
  const {
    root: { state: rootState },
    app: {
      runtime: {
        navigation,
      },
    },
  } = state;

  const trigger: number = 1;
  return {
    rootState,
    trigger,
    navigation,
    routes: props.routes,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<Action>,
  ownProps: OwnProps,
): DispatchProps {
  return {
    navigate: (nav: Navigation) => {
      dispatch(navigate(nav));
    },
  };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
  mapStateToProps,
  mapDispatchToProps,
)(View);
