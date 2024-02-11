"use client";

import { useEffect, useState } from "react";
import CreateServer from "../modals/create-server";
import InviteModal from "../modals/invite-modal";
import EditServer from "../modals/edit-server";
import MemberModal from "../modals/member-mgmt";
import CreateChannel from "../modals/create-channel";
import DeleteServer from "../modals/delete-server";
import LeaveServer from "../modals/leave-server";
import DeleteChannel from "../modals/delete-channel";
import EditChannel from "../modals/edit-channel";
import MessageAttachment from "../modals/message-attachment";
import DeleteMessage from "../modals/delete-message";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted) {
        return null;
    }
    
    return (
        <>
          <CreateServer />
          <InviteModal />
          <EditServer />
          <MemberModal />
          <CreateChannel />
          <DeleteServer />
          <LeaveServer />
          <DeleteChannel />
          <EditChannel />
          <MessageAttachment />
          <DeleteMessage />
        </>
    )
}