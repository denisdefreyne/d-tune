import * as React from "react";

import * as style from "./style.css";

interface PropsWithChild {
  children: React.ReactNode;
}

interface PropsWithOnClick {
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={style.button} />
);

export const StatusBox = (props: PropsWithChild) => (
  <div className={style.statusBox}>{props.children}</div>
);

interface PickListItemProps extends PropsWithChild, PropsWithOnClick {
  isSelected?: boolean;
  isSpecial?: boolean;
  isLast?: boolean;
  isPlaying?: boolean;
}

const classNamesForPickListItem = (props: PickListItemProps) =>
  [
    style.pickListItem,
    props.isSelected ? style.isSelected : null,
    props.isSpecial ? style.isSpecial : null,
    props.isLast ? null : style.isNotLast,
    props.isPlaying ? style.isPlaying : null,
  ].filter((e) => e).join(" ");

export const PickListItem = (props: PickListItemProps) => (
  <li className={classNamesForPickListItem(props)} onClick={props.onClick}>
    {props.children}
  </li>
);

export const Title = (props: {}) =>
  <div className={style.title}>D★<b>Tune</b></div>;
