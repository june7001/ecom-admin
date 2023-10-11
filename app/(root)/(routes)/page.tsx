"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect, useState } from "react";

import { redirect } from "next/navigation";

const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const onClose = useStoreModal((state) => state.onClose);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  const [foundStore, setFoundStore] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/stores");

      if (!response.ok) {
        redirect("/sign-in");
      }

      const userStores = (await response.json()) as { id: string }[];

      if (userStores.length > 0) {
        setFoundStore(userStores[0].id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!foundStore) return;
    onClose();
    redirect(`/${foundStore}`);
  }, [foundStore]);

  return null;
};

export default SetupPage;
