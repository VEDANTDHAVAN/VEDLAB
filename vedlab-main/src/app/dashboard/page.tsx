"use client";

import SketchCanvas from "~/components/canvas/SketchCanvas";
import { signout } from "../actions/auth";

export default function Page() {
    return (
        <div>
            <p>My Dashboard</p>
            <button onClick={() => signout()}>Sign Out</button>
            <SketchCanvas />
        </div>
    )
}