export enum ServerEvents {
  FRIEND_REQUEST_CREATED = "friendrequest.create",
  FRIEND_REQUEST_CANCELED = "friendrequest.cancel",
  FRIEND_REQUEST_ACCEPTED = "friendrequest.accepted",
  FRIEND_REQUEST_REJECTED = "friendrequest.rejected",
  FRIEND_REMOVED = "friend.removed",
  CONVERSATION_CREATED = "conversation.create",
  CONVERSATION_UPDATED = "conversation.update",
  MESSAGE_CREATED = "message.create",
  MESSAGE_DELETED = "message.delete",
  MESSAGE_UPDATED = "message.update",
  GET_ONLINE_FRIENDS = "onlineFriends.get",
}

export enum ClientEvents {
  GET_ONLINE_FRIENDS = "getOnlineFriends",
  TYPING_START = "typingStart",
  TYPING_STOP = "typingStop",
}

export enum WebsocketEvents {
  FRIEND_REQUEST_RECEIVED = "onFriendRequestReceived",
  FRIEND_REQUEST_CANCELLED = "onFriendRequestCancelled",
  FRIEND_REQUEST_ACCEPTED = "onFriendRequestAccepted",
  FRIEND_REQUEST_REJECTED = "onFriendRequestRejected",
  FRIEND_REMOVED = "onFriendRemoved",
  CONVERSATION_CREATED = "onConversation",
  CONVERSATION_UPDATED = "onConversationUpdate",
  MESSAGE_CREATED = "onMessage",
  MESSAGE_DELETED = "onMessageDelete",
  MESSAGE_UPDATED = "onMessageUpdate",
  ON_TYPING_START = "onTypingStart",
  ON_TYPING_STOP = "onTypingStop",
}

export enum Routes {
  AUTH = "auth",
  USERS = "users",
  FRIENDS = "friends",
  FRIEND_REQUESTS = "friends/requests",
  UPLOAD = "upload",
  CONVERSATIONS = "conversations",
  MESSAGES = "conversations/:id/messages",
}
