import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  setCall,
  setLocalStream,
  setRemoteStream,
} from "../features/call/callSlice";

export const useSetCall = () => {
  const { peer, callType, call, connection } = useAppSelector(
    (state) => state.call
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!peer) return;
    console.log("peer requests");
    peer.on("call", async (incomingCall) => {
      console.log("Incoming Call!!!!!");
      console.log(callType);
      const constraints = {
        video: {
          width: { min: 640, ideal: 1920, max: 1920 },
          height: { min: 480, ideal: 1080, max: 1080 },
        },
        audio: true,
      };
      console.log(constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Receiving Call & Got Local Stream:", stream.id);
      incomingCall.answer(stream);
      dispatch(setLocalStream(stream));
      dispatch(setCall(incomingCall));
    });
    return () => {
      peer.off("call");
    };
  }, [peer, callType, dispatch]);

  useEffect(() => {
    if (!call) return;

    call.on("stream", (remoteStream) =>
      dispatch(setRemoteStream(remoteStream))
    );

    call.on("close", () => console.log("call was closed"));

    return () => {
      call.off("stream");
      call.off("close");
    };
  }, [call]);

  useEffect(() => {
    if (connection) {
      console.log("connection is defined....");
      if (connection) {
        console.log("connection is defined...");
        connection.on("open", () => {
          console.log("connection was opened");
        });
        connection.on("error", () => {
          console.log("an error has occured");
        });
        connection.on("data", (data) => {
          console.log("data received", data);
        });
        connection.on("close", () => {
          console.log("connection closed");
        });
      }
      return () => {
        connection?.off("open");
        connection?.off("error");
        connection?.off("data");
      };
    }
  }, [connection]);
};
