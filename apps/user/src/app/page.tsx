import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 md:p-24 bg-gray-50 dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          WasteWise User Portal
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-dark-text-muted max-w-2xl mx-auto mb-8">
          Join WasteWise to start your journey towards responsible waste
          management
        </p>
      </section>

      {/* Auth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Sign Up Card */}
        <Link
          href="/auth/signup"
          className="group p-8 bg-white dark:bg-dark-card rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-400 text-center"
        >
          <div className="text-4xl mb-4">🌱</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-3">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-dark-text-muted">
            New to WasteWise? Join us and start making a difference today.
          </p>
        </Link>

        {/* Login Card */}
        <Link
          href="/auth/login"
          className="group p-8 bg-white dark:bg-dark-card rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-400 text-center"
        >
          <div className="text-4xl mb-4">🔑</div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-3">
            Sign In
          </h2>
          <p className="text-gray-600 dark:text-dark-text-muted">
            Already have an account? Welcome back!
          </p>
        </Link>
      </div>

      {/* Benefits Section */}
      <section className="mt-16 text-center max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-dark-text mb-6">
          Why Join WasteWise?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4">
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-medium mb-2 text-gray-900 dark:text-dark-text">
              Track Your Impact
            </h3>
            <p className="text-gray-600 dark:text-dark-text-muted text-sm">
              Monitor your contribution to environmental sustainability
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-medium mb-2 text-gray-900 dark:text-dark-text">
              Smart Scanning
            </h3>
            <p className="text-gray-600 dark:text-dark-text-muted text-sm">
              Easily identify and sort waste with our AI technology
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-medium mb-2 text-gray-900 dark:text-dark-text">
              Set Goals
            </h3>
            <p className="text-gray-600 dark:text-dark-text-muted text-sm">
              Create and achieve your waste reduction targets
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
