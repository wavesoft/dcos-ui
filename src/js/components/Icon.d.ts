import * as React from "react";

interface IconProps {
  className?: object[] | string | object;
  color?: string;
  family?: "product" | "system" | "tiny";
  id: string;
  size?: "tiny" | "mini" | "small" | "medium" | "large" | "jumbo";
  onClick: (event: any) => void;
}

export default class Icon extends React.Component<IconProps, {}> {}
