import * as React from "react";

import * as style from "./style.css";

interface PropsWithChild {
  children: React.ReactNode;
}

export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={style.button} />
);

export const StatusBox = (props: PropsWithChild) => (
  <div className={style.statusBox}>{props.children}</div>
);
