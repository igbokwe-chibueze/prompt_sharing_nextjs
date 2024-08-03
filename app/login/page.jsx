"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

/**
 * loginPage Component
 * Displays a popup encouraging the user to log in with a customizable message
 */
const LoginPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message") || 'Login/Logout';

    const [providers, setProviders] = useState(null);

    useEffect(() => {
        (async () => {
            const res = await getProviders();
            setProviders(res);
        })();
    }, []);

    const handleCancel = () => {
        router.back();
    };

    const handleHomeRedirect = () => {
        router.push('/');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Login Required</h3>
                <p className="mb-4">{message}</p>
                <div className="flex flex-col gap-4">
                    {!session?.user && (
                        <button
                            className="bg-gray-200 px-4 py-2 rounded"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}
                    
                    {session?.user ? (
                        <>
                            <button
                                type='button'
                                onClick={() => {
                                    signOut();
                                }}
                                className='mt-5 w-full bg-red-500 text-white px-4 py-2 rounded'
                            >
                                Sign Out
                            </button>
                            <button
                                type='button'
                                onClick={handleHomeRedirect}
                                className='mt-5 w-full bg-blue-500 text-white px-4 py-2 rounded'
                            >
                                Return Home
                            </button>
                        </>
                    ) : (
                        <>
                            {providers &&
                                Object.values(providers).map((provider) => (
                                    <button
                                        type='button'
                                        key={provider.name}
                                        onClick={() => {
                                            signIn(provider.id);
                                        }}
                                        className='bg-blue-500 text-white px-4 py-2 rounded'
                                    >
                                        Sign in with {provider.name}
                                    </button>
                                ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
