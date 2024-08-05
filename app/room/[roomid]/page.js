"use client";

import useUser from "@/hooks/useUser";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

const Room = ({ params }) => {
  const { fullName } = useUser();
  const roomID = params.roomid;
  const meetingRef = useRef(null);

  useEffect(() => {
    const myMeeting = async (element) => {
      const appID = parseInt(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      if (!appID || !serverSecret) {
        throw new Error("Missing Zego app ID or server secret");
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        uuid(),
        fullName || "user" + Date.now(),
        720
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Shareable link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        maxUsers: 10,
      });
    };

    if (meetingRef.current) {
      myMeeting(meetingRef.current);
    }
  }, [fullName, roomID]);

  return <div className="w-full h-screen" ref={meetingRef}></div>;
};

export default Room;
