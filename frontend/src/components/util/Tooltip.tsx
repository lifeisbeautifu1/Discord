type Props = {
  children: React.ReactNode;
  text: string;
  position?: "top" | "left" | "right" | "bottom";
};

const Tooltip: React.FC<Props> = ({ children, position = "top", text }) => {
  return (
    <div className="group relative">
      {children}
      <span
        className={`absolute left-1/2 z-[20] w-auto min-w-max translate-x-[-50%] scale-0 rounded-md bg-[#18191c] px-3 py-2 text-sm font-semibold text-d-gray shadow-md transition-all duration-100 ${
          position === "top" &&
          `-top-12 before:absolute before:-bottom-3.5 before:left-1/2 before:w-0 before:translate-x-[-50%] before:translate-y-[-50%] before:border-[5px] before:border-solid before:border-t-[#18191c] before:border-l-transparent before:border-b-transparent before:border-r-transparent before:bg-transparent group-hover:scale-100`
        }
        ${
          position === "bottom" &&
          "-bottom-12 before:absolute before:-top-1.5 before:left-1/2 before:w-0 before:translate-x-[-50%] before:translate-y-[-50%] before:border-[6px] before:border-solid before:border-b-[#18191c] before:border-r-transparent before:border-t-transparent before:border-l-transparent before:bg-transparent group-hover:scale-100"
        }`}
      >
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
