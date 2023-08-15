import type { ReactNode } from "react";
import React, { Fragment, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

interface ModalPropType {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  closeModal: () => void;
}
export default function Modal({
  closeModal,
  isOpen,
  children,
  title,
}: ModalPropType) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
