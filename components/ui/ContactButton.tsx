"use client";
// components/ui/ContactButton.tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

interface Props {
  recipientId: string;
  recipientName: string;
  fullWidth?: boolean;
}

export function ContactButton({ recipientId, recipientName, fullWidth }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (!session) {
      router.push(`/login?redirect=/messages?to=${recipientId}`);
    } else {
      router.push(`/messages?to=${recipientId}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`btn-primary flex items-center gap-2 ${fullWidth ? "w-full justify-center" : ""}`}
    >
      <MessageSquare size={15} />
      Message {recipientName.split(" ")[0]}
    </button>
  );
}
