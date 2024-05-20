"use client";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export const ToastProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isMounted === false) return null;

    return <Toaster />;
};
