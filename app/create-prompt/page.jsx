"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@components/Form";

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "", userId: null }); // Include userId in the post state

  const createPrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!session) {
        console.log("Creating post as anonymous user...");
        // Handle anonymous post creation here (e.g., store post without user info)
        // For demonstration purposes, assume the post is created successfully
        // Include userId as null for anonymous posts
        setPost({ ...post, userId: null });
        router.push("/");
        return;
      }

      const response = await fetch("/api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to create post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  );
};

export default CreatePrompt;
