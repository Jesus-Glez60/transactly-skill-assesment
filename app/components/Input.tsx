'use client';

export default function Input({
  label,
  id,
  type,
}: {
  label: string;
  id: string;
  type: string;
}) {
  return (
    <section className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        className="rounded-md border border-gray-300 p-2"
      />
    </section>
  );
}
