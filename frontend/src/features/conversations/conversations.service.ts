import axios from "axios";
import { Conversation, Message } from "../../types";
import { Notification } from "../../types";
import { EditMessageParams } from "../../types/editMessageParams";
import { GetMessagesPayload } from "../../types/getMessagesPayload";

const getNotifications = async () => {
  const { data } = await axios.get<Array<Notification>>("/notifications");
  return data;
};

const clearNotifications = async (conversationId: string) => {
  await axios.delete("/notifications/" + conversationId);
  return;
};

const getConversations = async () => {
  const { data } = await axios.get<Array<Conversation>>("/conversations");
  return data;
};

const getConversation = async (id: string) => {
  const { data } = await axios.get<Conversation>(`/conversations/${id}`);
  return data;
};

const createConversation = async (participantsIds: Array<string>) => {
  return axios.post("/conversations", {
    participantsIds,
  });
};

const getMessages = async (id: string) => {
  const { data } = await axios.get<GetMessagesPayload>(
    `/conversations/${id}/messages`
  );
  return data;
};

const getMessagesAfterMessage = async (
  conversationId: string,
  messageId: string
) => {
  const { data } = await axios.get<GetMessagesPayload>(
    `/conversations/${conversationId}/messages/${messageId}`
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
  return axios.patch<Message>(
    `/conversations/${conversationId}/messages/${messageId}`,
    {
      content,
    }
  );
};

const deleteMessage = async (converastionId: string, messageId: string) => {
  return await axios.delete<{ messageId: string }>(
    `/conversations/${converastionId}/messages/${messageId}`
  );
};

export default {
  getNotifications,
  clearNotifications,
  getConversations,
  getConversation,
  createConversation,
  getMessages,
  getMessagesAfterMessage,
  sendMessage,
  editMessage,
  deleteMessage,
};
