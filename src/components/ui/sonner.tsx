"use client";

import { Toast } from "@base-ui/react/toast";
import type { ToasterProps } from "@/app/_types";
import { toastManager } from "@/lib/toast";
import {
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((item) => (
    <ToastRoot key={item.id} toast={item} data-type={item.type ?? "info"}>
      <ToastContent>
        <div>
          {item.title && <ToastTitle>{item.title}</ToastTitle>}
          {item.description && <ToastDescription>{item.description}</ToastDescription>}
        </div>
        <ToastClose aria-label="Dismiss notification">×</ToastClose>
      </ToastContent>
    </ToastRoot>
  ));
}

export function Toaster({ children }: ToasterProps) {
  return (
    <ToastProvider toastManager={toastManager} limit={4} timeout={4500}>
      {children}
      <Toast.Portal>
        <ToastViewport aria-label="Notifications">
          <ToastList />
        </ToastViewport>
      </Toast.Portal>
    </ToastProvider>
  );
}
