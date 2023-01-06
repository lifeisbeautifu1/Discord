import { ReactElement } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  to: string;
  tooltip?: string;
  textColor?: string;
  icon?: ReactElement;
  hover?: string;
  main?: boolean;
  size?: string;
  text?: string;
  classNames?: string;
  notifications?: number;
};

const ServerIcon: React.FC<Props> = ({
  to,
  tooltip,
  textColor = "text-white",
  text,
  icon,
  main,
  size = "text-[22px]",
  hover = "hover:bg-brand",
  classNames,
  notifications,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? `duration relative flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-brand ${size} ${textColor} transition-all duration-200 ease-out hover:rounded-2xl ${hover} ${classNames} after:transtion-all group after:absolute after:top-1/2 after:-left-3.5 after:h-9 after:w-1.5 after:-translate-y-1/2 after:rounded-br after:rounded-tr after:bg-white after:duration-200 after:ease-out hover:text-white  ${
              main && "text-[28px] !text-white"
            }`
          : `duration relative flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-3xl bg-dark ${size} ${textColor} transition-all duration-200 ease-out hover:rounded-2xl hover:after:absolute hover:after:top-1/2 hover:after:-left-3.5 hover:after:h-5 hover:after:w-1.5 hover:after:-translate-y-1/2 hover:after:rounded-br hover:after:rounded-tr hover:after:bg-white hover:after:transition-all hover:after:duration-200 hover:after:ease-out ${hover} ${classNames} group hover:text-white ${
              main && "text-[28px] !text-white"
            }`
      }
    >
      {text}
      {icon}
      {typeof notifications !== "undefined" && notifications > 0 && (
        <span className="pill absolute -bottom-1 -right-1 box-content border-4 border-d-dark-black">
          {notifications > 9 ? "9+" : notifications}
        </span>
      )}
      {tooltip && (
        <span className="absolute left-16 z-[20] m-2 min-w-max origin-left scale-0 rounded-md bg-[#111] px-3 py-2 text-sm font-bold text-white shadow-md transition-all duration-100 before:absolute before:top-1/2 before:-left-2.5 before:w-0 before:translate-y-[-50%] before:border-[5px] before:border-solid before:border-t-transparent before:border-l-transparent before:border-b-transparent before:border-r-[#111] before:bg-transparent group-hover:scale-100">
          {tooltip}
        </span>
      )}
    </NavLink>
  );
};

export default ServerIcon;
