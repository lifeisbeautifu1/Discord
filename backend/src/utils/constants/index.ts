export enum ServerEvents {
  FRIEND_REQUEST_CREATE = "friendrequest.create",
  FRIEND_REQUEST_CANCEL = "friendrequest.cancel",
  FRIEND_REQUEST_ACCEPTED = "friendrequest.accepted",
  FRIEND_REQUEST_REJECTED = "friendrequest.rejected",
  FRIEND_REMOVED = "friend.removed",
  CONVERSATION_CREATE = "conversation.create",
  MESSAGE_CREATE = "message.create",
}

export enum ClientEvents {
  GET_ONLINE_FRIENDS = "getOnlineFriends",
}

export enum WebsocketEvents {
  FRIEND_REQUEST_RECEIVED = "onFriendRequestReceived",
  FRIEND_REQUEST_CANCELLED = "onFriendRequestCancelled",
  FRIEND_REQUEST_ACCEPTED = "onFriendRequestAccepted",
  FRIEND_REQUEST_REJECTED = "onFriendRequestRejected",
  FRIEND_REMOVED = "onFriendRemoved",
  CONVERSATION_CREATED = "onConversation",
  MESSAGE_CREATED = "onMessage",
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
