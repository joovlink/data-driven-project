import Link from "next/link";

export default function NotFound() {
    return (
        <div
            className="flex items-center justify-center min-h-screen px-6 text-center bg-cover bg-center"
            style={{ backgroundImage: `url('/images/arthatelnotfound.jpg')` }}
        >
            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-xl max-w-md">
                <h2 className="text-lg font-bold mb-2">Oops! Something went wrong.</h2>
                <p className="text-sm text-gray-600">
                    We couldn’t find the page you’re looking for.
                </p>
                <Link
                    href="/client-login"
                    className="text-blue-600 font-semibold hover:underline mt-4 inline-block"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    )
}