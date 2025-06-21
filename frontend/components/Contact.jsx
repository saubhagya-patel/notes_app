import React, { useRef, useContext } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

import { NotesContext } from "../src/context/NotesContext";
import config from "../src/config/config";

function Contact() {
  const form = useRef();
  const { user } = useContext(NotesContext);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        config.emailjs_service_id,
        config.emailjs_template_id,
        form.current,
        config.emailjs_public_api_key
      )
      .then(
        () => {
          toast.success("✅ Message sent successfully!");
          form.current.reset();
        },
        (error) => {
          toast.error("❌ Failed to send message. Please try again.");
          console.error(error.text);
        }
      );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white px-4">
        <div className="max-w-md p-8 bg-gray-800 rounded-lg shadow-lg text-center space-y-4">
          <h2 className="text-2xl font-semibold text-red-400">Access Denied</h2>
          <p className="text-gray-300">
            You must be{" "}
            <span className="text-blue-400 font-medium">logged in</span> to send
            a message.
          </p>
          <p className="text-sm text-gray-500">
            Please log in using your account to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <form
        ref={form}
        onSubmit={sendEmail}
        className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg flex flex-col gap-6"
      >
        <h2 className="text-3xl font-semibold text-center">Contact Us</h2>

        <input
          name="name"
          value={user.name}
          readOnly
          className="p-3 rounded bg-gray-700 text-white outline-none"
          required
        />

        <input
          name="email"
          value={user.email}
          readOnly
          className="p-3 rounded bg-gray-700 text-white outline-none"
          required
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          className="p-3 rounded bg-gray-700 text-white outline-none resize-none"
          required
        ></textarea>

        <button
          type="submit"
          className="p-3 bg-blue-600 hover:bg-blue-700 rounded font-medium"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
