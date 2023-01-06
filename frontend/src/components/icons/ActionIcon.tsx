import { Tooltip } from "../";

type Props = {
  icon: React.ReactElement;
  tooltip: string;
  onClick?: () => void;
  hoverColor?: string;
};

const ActionIcon: React.FC<Props> = ({
  icon,
  tooltip,
  onClick,
  hoverColor = "hover:text-d-gray",
}) => {
  return (
    <Tooltip text={tooltip}>
      <div
        onClick={onClick}
        className={`fr-icon rounded-full ${hoverColor} bg-[#2f3136] p-2 text-xl text-d-gray transition-all ease-out group-hover:bg-d-dark-black `}
      >
        {icon}
      </div>
    </Tooltip>
  );
};

export default ActionIcon;
