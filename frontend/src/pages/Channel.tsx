import { useParams } from "react-router-dom";

const ChannelPage = () => {
  const { id } = useParams();
  return <div>channel {id}</div>;
};

export default ChannelPage;
