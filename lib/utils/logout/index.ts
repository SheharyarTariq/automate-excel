"use client";

import { clearTokens } from "../auth-cookies";
import { routes } from "../../routes";

export async function handleLogout(): Promise<void> {
  clearTokens();
  window.location.href = routes.ui.login;
}
