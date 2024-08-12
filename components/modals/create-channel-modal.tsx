"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useCallback, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { useModal } from "@/hooks/use-modal-store";
import { CreateChannelSchema } from "@/actions/create-channel/shema";
import { ChannelType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useParams } from "next/navigation";
import { createChannel } from "@/actions/create-channel";
import { toast } from "sonner";

export const CreateChannelModal = () => {
  const params = useParams();
  const serverId = (params?.serverId ?? "") as string;

  const { isOpen, onClose, type, onOpen, data } = useModal();

  const { channelType } = data;

  const isModalOpen = isOpen && type === "createChannel";

  const { execute, isLoading } = useAction(createChannel, {
    onError() {
      toast.error("Failed to create channel");
    },
    onSuccess(data) {
      toast.success("Channel created successfully");
      onOpen("createChannel", { server: data });
      form.reset();
      onClose();
    },
  });

  const form = useForm({
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: {
      name: "",
      type: channelType ?? ChannelType.TEXT,
      serverId,
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof CreateChannelSchema>) => {
      execute({ ...values });
    },
    [execute]
  );

  const handleClose = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    if (channelType) {
      form.setValue("type", channelType);
    } else {
      form.setValue("type", ChannelType.TEXT);
    }
  }, [channelType, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() =>
              onSubmit({
                ...form.getValues(),
                serverId,
              })
            )}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0  focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            className="capitalize"
                            value={type}
                            key={type}
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button
                type="submit"
                className="w-full md:!w-auto"
                disabled={isLoading || !form.formState.isValid}
                variant="primary"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
