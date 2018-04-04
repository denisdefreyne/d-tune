import * as React from "react";

export interface InjectedProps {
  idToken: string;
}

interface State {
  idToken: string | null;
  error: string | null;
}

interface Options {
  debug?: boolean;
}

const authenticated = ({ debug = false }: Options = {}) =>
  <TOriginalProps extends {}>(
    Component: (React.ComponentClass<TOriginalProps & InjectedProps>
              | React.StatelessComponent<TOriginalProps & InjectedProps>),
  ) => {
    type ResultProps = TOriginalProps;

    const result = class Authenticated extends React.Component<ResultProps, State> {
      public static displayName =
        `Authenticated(${Component.displayName || Component.name})`;

      constructor(props: ResultProps) {
        super(props);

        this.state = {
          idToken: null,
          error: null,
        };
      }

      public componentDidMount() {
        window.onSignIn = (googleUser: any) => {
          const email = googleUser.getBasicProfile().getEmail();
          const idToken = googleUser.getAuthResponse().id_token;
          this.setState({ idToken });
        };
      }

      public render() {
        if (this.state.idToken) {
          return this.renderWrapped(this.state.idToken);
        } else if (this.state.error) {
          return <div style={{ margin: "40px" }}>{this.state.error}</div>;
        } else {
          return this.renderSignin();
        }
      }

      private renderSignin = () => (
        <div className="g-signin2" style={{ margin: "40px" }} data-onsuccess="onSignIn"></div>
      )

      private renderWrapped(idToken: string): JSX.Element {
        return <Component idToken={idToken} {...this.props} />;
      }
    };

    return result;
  };

export default authenticated;
