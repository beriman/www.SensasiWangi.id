import React from "react";
import ReactDOMServer from "react-dom/server";

export interface EmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ to, subject, react }: EmailOptions) {
  const html = ReactDOMServer.renderToStaticMarkup(react);
  const endpoint =
    (typeof process !== "undefined" && process.env.EMAIL_ENDPOINT) || "";
  if (endpoint) {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });
  } else {
    console.log("sendEmail", { to, subject });
  }
}
