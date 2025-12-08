"use client";

import useSearchModal from "@/hooks/use-search-modal";
import Modal from "./Modal";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const SearchModal = () => {
  const { isOpen, onCLose } = useSearchModal();

  const onChange = (open: boolean) => {
    if (!open) {
      onCLose();
    }
  };

  return (
    <Modal
      title="Search by products"
      description=" "
      isOpen={isOpen}
      onChange={onChange}
    >
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Billing</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Modal>
  );
};
export default SearchModal;
