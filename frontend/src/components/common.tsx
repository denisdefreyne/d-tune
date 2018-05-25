import * as React from "react";
import * as styledComponents from "styled-components";

import * as style from "./style.css";

const {
  default: styled,
} = styledComponents;

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

export const Grid = styled.div`
  display: grid;

  position: relative;

  height: calc(100vh - 2*15px);
  padding: 15px;

  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-gap: 15px;

  justify-content: space-between;
`;

export const Col = styled.div`
  position: relative;
`;

export const MiniTitle = styled.span`
  text-transform: uppercase;

  font-weight: normal;
  font-size: 12px;
`;

export const ColTitle = styled.h2`
  text-transform: uppercase;

  font-weight: normal;
  font-size: 12px;

  margin: 0 0 5px 5px;
  padding: 0;
`;

export const PickList = styled.ul`
  border: 1px solid #000;

  box-shadow: 3px 3px 0 #ccc;

  padding: 3px 0;

  overflow-x: hidden;
  overflow-y: scroll;

  position: absolute;
  top: 20px;
  bottom: 0;
  right: 0;
  left: 0;
`;

export const DetailBox = styled.div`
  border: 1px solid #000;

  box-shadow: 3px 3px 0 #ccc;

  padding: 10px;

  overflow-x: hidden;
  overflow-y: scroll;

  position: absolute;
  top: 20px;
  bottom: 0;
  right: 0;
  left: 0;
`;

export const PickListSubtitle = styled.div`
  font-style: italic;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
