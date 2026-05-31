"use client";

import { usePathname, useRouter } from "next/navigation";
import { TextInput } from "@payloadcms/ui";
import type { ChangeEvent } from "react";
import { useState } from "react";

export const SearchUsers = ({
  defaultSearchValue,
}: {
  defaultSearchValue: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState<string>(defaultSearchValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSearch(value);

    if (value.length <= 2) {
      router.replace(pathname);
    } else {
      const params = new URLSearchParams({ search: value });

      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      <TextInput
        path="search"
        value={search}
        label="Search for users"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchUsers;
