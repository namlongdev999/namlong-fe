"use client";
import { isNotEmpty } from "@mantine/form";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function useQueryParams(keys) {
  const searchParams = useSearchParams(); // ✅ Get search params
  const pathname = usePathname(); // ✅ Get current path
  const router = useRouter(); // ✅ Next.js router

  // ✅ Extract only the needed params from the URL
  const paramsObject = {};
  keys.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      paramsObject[key] = value;
    }
  });

  // ✅ Update multiple query params at once
  const updateParam = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key); // ✅ Remove empty params
      } else {
        params.set(key, String(value)); // ✅ Update param
      }
    });

    router.push(`${pathname}?${params.toString()}`); // ✅ Redirect with new query params
  };

  return [isNotEmpty(paramsObject) ? paramsObject : undefined, updateParam];
}
