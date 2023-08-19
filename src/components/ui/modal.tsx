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
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent className={twMerge("", className)}>
        {title ? (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        ) : null}
        {children}
      </DialogContent>
    </Dialog>
  );
}
