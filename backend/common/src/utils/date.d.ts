export declare const formatDate: (date: Date, format?: string) => string;
export declare const parseDate: (dateString: string, format?: string) => Date;
export declare const diffInDays: (date1: Date, date2: Date) => number;
export declare const addDays: (date: Date, days: number) => Date;
export declare const isValidDate: (dateString: string, format?: string) => boolean;
export declare const toUnixTimestamp: (date: Date) => number;
