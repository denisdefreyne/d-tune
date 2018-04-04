import * as React from "react";

export interface InjectedProps {
  getIdToken: () => string | null;
}

interface OriginalProps {
  baseURL: string;
}

interface GoogleUserBasicProfile {
  getEmail: () => string;
}

interface GoogleUserAuthResponse {
  id_token: string;
}

interface GoogleUser {
  getAuthResponse: () => GoogleUserAuthResponse;
  getBasicProfile: () => GoogleUserBasicProfile;
}

interface AuthStateInitial {
  kind: "AuthStateInitial";
}

interface AuthStateSignedIn {
  kind: "AuthStateSignedIn";
  googleUser: GoogleUser;
}

interface AuthStateVerified {
  kind: "AuthStateVerified";
  googleUser: GoogleUser;
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

declare global {
  interface Window { onSignIn: (u: GoogleUser) => void; }
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
        window.onSignIn = (googleUser: GoogleUser) => {
          const email = googleUser.getBasicProfile().getEmail();
          this.setState({ authState: { kind: "AuthStateSignedIn", googleUser } });
          this.verify(googleUser);
        };
      }

      public render() {
        switch (this.state.authState.kind) {
          case "AuthStateInitial":
            return this.renderSignin();

          case "AuthStateSignedIn":
            return <div style={{ margin: "40px" }}>Verifying…</div>;

          case "AuthStateVerified":
            return <Component getIdToken={this.getIdToken} {...this.props} />;

          case "AuthStateFailed":
            return <div style={{ margin: "40px" }}><strong>Error!</strong> {this.state.authState.reason}</div>;
        }
      }

      private renderSignin = () => (
        <div className="g-signin2" style={{ margin: "40px" }} data-onsuccess="onSignIn"></div>
      )

      private getIdToken = (): string | null =>
        this.state.authState.kind === "AuthStateVerified"
          ? this.state.authState.googleUser.getAuthResponse().id_token
          : null

      private verify(googleUser: GoogleUser) {
        const onSuccess = (response: Response) => {
          if (response.ok) {
            this.setState({
              authState: { kind: "AuthStateVerified", googleUser },
            });
          } else {
            response.json().then((body) => {
              this.setState({
                authState: { kind: "AuthStateFailed", reason: body.reason },
              });
            });
          }
        };

        const idToken = googleUser.getAuthResponse().id_token;
        const headers = { "Dtune-Access-Token": idToken };
        fetch(this.props.baseURL + "/test", { headers })
          .then(onSuccess);
      }
    };

    return result;
  };

export default authenticated;
