"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from "@/hooks/modal-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import qs from "query-string";

export const DeleteMessage = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { apiUrl, query } = data;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url:apiUrl || "",
        query,
      })
      await axios.delete(url);  
      onClose();
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-50 text-black p-0 overflow-hidden rounded-lg">
        <DialogHeader className="pt-10 px-8">
          <DialogTitle className="text-3xl text-center font-semibold">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-md text-center p-2">
            Are you sure you want to delete this message?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-zinc-200 px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button className="ml-auto" disabled={isLoading} onClick={onClick}>
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteMessage;
