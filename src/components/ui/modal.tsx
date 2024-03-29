import type { ReactNode } from "react";
import React, { Fragment, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { twMerge } from "tailwind-merge";

interface ModalPropType {
  children: ReactNode;
  title?: string;
  isOpen: boolean;
  closeModal: () => void;
  className?: string;
}
export default function Modal({
  closeModal,
  isOpen,
  children,
  title,
  className = "",
}: ModalPropType) {
  return (
    <Dialog
      open={isOpen}
      modal
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent className={twMerge("", className)}>
        {title ? (
          <DialogHeader className="relative w-full">
            <DialogTitle className="text-center">{title}</DialogTitle>
          </DialogHeader>
        ) : null}
        {children}
      </DialogContent>
    </Dialog>
  );
}
