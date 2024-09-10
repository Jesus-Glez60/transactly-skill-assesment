'use client';

export default function Form({
  children,
  formAction,
}: Readonly<{
  children: React.ReactNode;
  formAction: string | ((formData: FormData) => void) | undefined;
}>) {
  return (
    <form
      action={formAction}
      className="flex flex-col gap-8 rounded-lg border border-zinc-600/30 bg-white px-8 py-4"
    >
      {children}
    </form>
  );
}
