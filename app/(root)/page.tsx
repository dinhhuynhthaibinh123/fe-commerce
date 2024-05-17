import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function SetupPage() {
    return (
        <div className="p-4">
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton afterSignOutUrl="/fwafwa" />
            </SignedIn>
        </div>
    );
}
