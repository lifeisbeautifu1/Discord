import axios from "axios";
import { Conversation, Message } from "../../types";
import { EditMessageParams } from "../../types/editMessageParams";

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

const editMessage = async ({
  content,
  messageId,
  conversationId,
}: EditMessageParams) => {
  await axios.patch(`/conversations/${conversationId}/messages/${messageId}`, {
    content,
  });
  return;
};

const deleteMessage = async (converastionId: string, messageId: string) => {
  const { data } = await axios.delete<{ messageId: string }>(
    `/conversations/${converastionId}/messages/${messageId}`
  );
  return data;
};

export default {
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
};
