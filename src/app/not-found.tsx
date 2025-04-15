"use client";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-xl">
        Page not found or you are not authorized to view this page
      </p>
    </div>
  );
}
