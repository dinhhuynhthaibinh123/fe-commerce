"use client";

import {
    Check,
    ChevronsUpDown,
    PlusCircle,
    Store as StoreIcom,
    StoreIcon,
} from "lucide-react";
import { useState } from "react";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    PopoverTrigger,
    Popover,
    PopoverContent,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { cn } from "@/lib/utils";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
    typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
}

export default function StoreSwitcher({
    className,
    items = [],
}: StoreSwitcherProps) {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const currentStore = formattedItems.find(
        (item) => item.value === params.storeId
    );

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store: { value: string; label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-label="Select a store"
                    className={cn("w-[200px] items-center", className)}
                >
                    <StoreIcom className="mr-2 w-4 h-4" />
                    Current Store
                    <ChevronsUpDown className="ml-auto w-4 h-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search stores..." />
                        <CommandEmpty>No stores found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store) => {
                                return (
                                    <CommandItem
                                        key={store.value}
                                        value={store.value}
                                        onSelect={() => onStoreSelect(store)}
                                    >
                                        <StoreIcon className="mr-2 w-4 h-4" />
                                        {store.label}
                                        <Check
                                            className={cn(
                                                "ml-auto w-4 h-4",
                                                currentStore?.value ===
                                                    store.value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 w-5 h-5" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
