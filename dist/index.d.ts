export function systemProfiler(opts: {
    dataTypes?: string[];
    maxBuffer?: number;
    timeout?: number | string;
    detailLevel?: "mini" | "basic" | "full";
    normalize?: boolean;
    cwd?: string;
}, cb?: (err: NodeJS.ErrnoException | null, out?: unknown | Info[]) => void): Promise<Info[] | plist.PlistValue>;
export function listDataTypes(opts?: {
    cwd?: string;
    maxBuffer?: number;
}, cb?: (err: NodeJS.ErrnoException | null, json?: string[]) => void): Promise<string[] | "">;
export type Info = {
    name: string;
    items: import("plist").PlistValue;
    properties: import("plist").PlistValue;
};
import plist from 'plist';
