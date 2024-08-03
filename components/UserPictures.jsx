"use client"

import { useEffect, useState } from "react";
import Image from 'next/image';
import Loading from "@app/loading";

const UserPictures = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setAllUsers(data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex justify-center md:justify-start items-center -space-x-4 overflow-hidden p-2 mb-4 w-full md:w-auto">
            {loading ? (
                <div><Loading/></div> // Or a spinner component
            ) : (
                allUsers.map((user) => (
                    <div key={user.email}>
                        <Image 
                            src={user.image} 
                            alt={user.email} 
                            width={60} 
                            height={60} 
                            className="object-cover border-2 border-white rounded-full" 
                        />
                    </div>
                ))
            )}
        </div>
    );
}

export default UserPictures;
