import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/LocaleContext";
import { ProfileFormState } from "../types";
import { validateProfile } from "../Profile.Validation";

export function useProfileForm() {
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();
  const { PROFILE_TEXT } = useContent();

  const [form, setForm] = useState<ProfileFormState>({
    username: "",
    email: "",
  });

  const [original, setOriginal] =
    useState<ProfileFormState>({
      username: "",
      email: "",
    });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync user → form
  useEffect(() => {
    if (!user) return;

    const userData = {
      username: user.username ?? "",
      email: user.email ?? "",
    };

    setOriginal(userData);

    if (!isEditing) {
      setForm(userData);
    }
  }, [user, isEditing]);

  const updateField = (
    field: keyof ProfileFormState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const save = async () => {
    const validation = validateProfile(
      {
        username: form.username,
        email: form.email,
        originalUsername: original.username,
        originalEmail: original.email,
      },
      PROFILE_TEXT.validation
    );

    if (validation.success === false) {
      setError(validation.message);
      return;
    }

    if (validation.success === "noChanges") {
      setSuccess(validation.message);
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(validation.data);

      setSuccess(PROFILE_TEXT.messages.updated);
      setOriginal(validation.data);
      setIsEditing(false);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : PROFILE_TEXT.messages.updateError;

      if (message.includes("already exists")) {
        setError(PROFILE_TEXT.messages.emailExists);
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = () => {
    setForm(original);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const logoutUser = () => {
    logout();
    router.push("/");
  };

  return {
    form,
    updateField,
    isEditing,
    isSubmitting,
    error,
    success,
    startEdit: () => setIsEditing(true),
    save,
    cancel,
    logoutUser,
  };
}