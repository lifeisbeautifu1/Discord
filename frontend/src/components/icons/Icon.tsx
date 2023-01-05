import { ReactElement } from "react";
import { Tooltip } from "../";

type Props = {
  icon?: ReactElement;
  tooltip?: string;
  size?: string;
  position?: "top" | "bottom" | "left" | "right";
};

const Icon: React.FC<Props> = ({ tooltip, icon, size = "text-lg" }) => {
  return tooltip ? (
    <Tooltip text={tooltip}>
      <div
        className={`flex cursor-pointer items-center justify-center rounded bg-transparent p-1.5 ${size} hover:bg-d-icon-bg`}
      >
        {icon}
      </div>
    </Tooltip>
  ) : (
    <div
      className={`flex cursor-pointer items-center justify-center rounded bg-transparent p-1.5 ${size} hover:bg-d-icon-bg`}
    >
      {icon}
    </div>
  );
};

export default Icon;
