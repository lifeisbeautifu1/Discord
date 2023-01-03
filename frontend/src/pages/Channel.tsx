import { useParams } from "react-router-dom";
import { useAuthorized } from "../hooks/useAuthorized";

const ChannelPage = () => {
  useAuthorized();
  const { id } = useParams();
  return <div>channel {id}</div>;
};

export default ChannelPage;
