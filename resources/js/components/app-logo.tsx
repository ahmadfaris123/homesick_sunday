import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

type SharedProps = {
    name: string;
    appSettings?: {
        app_name: string;
        logo_url: string | null;
    };
};

export default function AppLogo() {
    const { name, appSettings } = usePage<SharedProps>().props;
    const logoUrl = appSettings?.logo_url;
    const appName = appSettings?.app_name || name;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={appName}
                        className="size-full object-cover"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {appName}
                </span>
            </div>
        </>
    );
}
