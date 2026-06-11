import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    accounts: z
        .array(z.string())
        .min(1, "You must select at least one account.")
        .max(3, "You can select a maximum of 3 accounts."),
});

export interface AccountOption {
    id: string;
    name: string;
}

interface SelectAccountsModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: AccountOption[];
    channelName: string;
    onSubmit: (selectedAccounts: string[]) => Promise<void>;
}

export function SelectAccountsModal({
    isOpen,
    onClose,
    accounts,
    channelName,
    onSubmit,
}: SelectAccountsModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accounts: [],
        },
    });

    // Reset form when modal opens with new accounts
    useEffect(() => {
        if (isOpen) {
            form.reset({ accounts: [] });
        }
    }, [isOpen, form]);

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);
            await onSubmit(data.accounts);
            onClose();
        } catch (error) {
            console.error("Failed to submit accounts:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select {channelName} Accounts</DialogTitle>
                    <DialogDescription>
                        Choose which accounts you'd like to connect. You can select up to 3 accounts.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
                        <FormField
                            control={form.control}
                            name="accounts"
                            render={() => (
                                <FormItem>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto px-1">
                                        {accounts.map((account) => (
                                            <FormField
                                                key={account.id}
                                                control={form.control}
                                                name="accounts"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={account.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(account.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, account.id])
                                                                            : field.onChange(
                                                                                  field.value?.filter(
                                                                                      (value) => value !== account.id
                                                                                  )
                                                                              );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="font-medium text-sm leading-none cursor-pointer">
                                                                {account.name}
                                                            </FormLabel>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
