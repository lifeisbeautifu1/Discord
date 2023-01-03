import { useRouter } from "next/router";
import { useAuthorized } from "../../hooks/useAuthorized";

const ChannelPage = () => {
  useAuthorized();
  const {
    query: { id },
  } = useRouter();
  return <div>channel {id}</div>;
};

export default ChannelPage;
