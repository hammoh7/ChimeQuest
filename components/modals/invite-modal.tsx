"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from "@/hooks/modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckCircle, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const isModalOpen = isOpen && type === "invite";
  const { server } = data;
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-50 text-black p-0 overflow-hidden rounded-lg">
        <DialogHeader className="pt-10 px-8">
          <DialogTitle className="text-3xl text-center font-semibold">
            Invite Friends!!
          </DialogTitle>
        </DialogHeader>
        <div className="p-5">
          <Label className="uppercase text-sm font-bold text-slate-500 dark:text-secondary/80">
            Invite Link
          </Label>
          <div className="flex items-center mt-3 gap-x-3">
            <Input
              disabled={isLoading}
              className="bg-gray-200 border-0 rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-black"
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              onClick={onCopy}
              className="bg-gray-50 text-black hover:bg-slate-200"
              size="icon"
            >
              {copied ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            size="sm"
            className="bg-indigo-100 hover:bg-indigo-300 text-blue-700 border-none mt-4"
          >
            Generate new link
            <RefreshCcw className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InviteModal;
