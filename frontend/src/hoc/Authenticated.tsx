import * as React from "react";

export interface InjectedProps {
  idToken: string;
}

interface OriginalProps {
  baseURL: string;
}

interface AuthStateInitial {
  kind: "AuthStateInitial";
}

interface AuthStateSignedIn {
  kind: "AuthStateSignedIn";
  idToken: string;
}

interface AuthStateVerified {
  kind: "AuthStateVerified";
  idToken: string;
}

interface AuthStateFailed {
  kind: "AuthStateFailed";
  reason: string;
}

type AuthState =
  AuthStateInitial |
  AuthStateSignedIn |
  AuthStateVerified |
  AuthStateFailed;

interface State {
  authState: AuthState;
}

interface Options {
  debug?: boolean;
}

const authenticated = ({ debug = false }: Options = {}) =>
  <TOriginalProps extends OriginalProps>(
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
          authState: { kind: "AuthStateInitial" },
        };
      }

      public componentDidMount() {
        window.onSignIn = (googleUser: any) => {
          const email = googleUser.getBasicProfile().getEmail();
          const idToken = googleUser.getAuthResponse().id_token;
          this.setState({ authState: { kind: "AuthStateSignedIn", idToken } });
          this.verify(idToken);
        };
      }

      public render() {
        switch (this.state.authState.kind) {
          case "AuthStateInitial":
            return this.renderSignin();

          case "AuthStateSignedIn":
            return <div style={{ margin: "40px" }}>Verifying…</div>;

          case "AuthStateVerified":
            return <Component idToken={this.state.authState.idToken} {...this.props} />;

          case "AuthStateFailed":
            return <div style={{ margin: "40px" }}><strong>Error!</strong> {this.state.authState.reason}</div>;
        }
      }

      private renderSignin = () => (
        <div className="g-signin2" style={{ margin: "40px" }} data-onsuccess="onSignIn"></div>
      )

      private renderWrapped(idToken: string): JSX.Element {
        return <Component idToken={idToken} {...this.props} />;
      }

      private verify(idToken: string) {
        const onSuccess = (response: Response) => {
          if (response.ok) {
            this.setState({
              authState: { kind: "AuthStateVerified", idToken },
            });
          } else {
            response.json().then((body) => {
              this.setState({
                authState: { kind: "AuthStateFailed", reason: body.reason },
              });
            });
          }
        };

        const headers = { "Dtune-Access-Token": idToken };
        fetch(this.props.baseURL + "/test", { headers })
          .then(onSuccess);
      }
    };

    return result;
  };

export default authenticated;
