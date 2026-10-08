import { UsersClient } from "./UsersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
};

export default function UsersPage() {
  return <UsersClient />;
}
