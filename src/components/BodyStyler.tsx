"use client";

import { useSettings } from "@/hooks/use-settings";
import { useEffect } from "react";

export function BodyStyler() {
    const { settings } = useSettings();

    useEffect(() => {
        if (settings.showBackgroundPattern) {
            document.body.classList.add('background-pattern-active');
        } else {
            document.body.classList.remove('background-pattern-active');
        }
    }, [settings.showBackgroundPattern]);

    return null;
}
