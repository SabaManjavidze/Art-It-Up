import type { ReactNode } from "react";
import React, { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-hidden">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-75"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-75"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-skin-light-secondary 
              p-6 text-left align-middle shadow-xl transition-all"
              >
                <Dialog.Title
                  as="h2"
                  className="text-xl font-medium leading-6 text-gray-100"
                >
                  {title}
                </Dialog.Title>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
