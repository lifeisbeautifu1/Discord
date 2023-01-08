import axios from "axios";
import { Conversation, Message } from "../../types";

const getConversations = async () => {
  const { data } = await axios.get<Array<Conversation>>("/conversations");
  return data;
};

const getConversation = async (id: string) => {
  const { data } = await axios.get<Conversation>(`/conversations/${id}`);
  return data;
};

const getMessages = async (id: string) => {
  const { data } = await axios.get<Array<Message>>(
    `/conversations/${id}/messages`
  );
  return data;
};

const sendMessage = async (id: string, content: string) => {
  await axios.post(`/conversations/${id}/messages`, {
    content,
  });
  return;
};

export default {
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
};
