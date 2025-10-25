export class Document {
    constructor(
        public readonly type: string,
        public readonly number: string,
        public readonly front?: string,
        public readonly back?: string
    ) { }

    isValidNumber(): boolean {
        return /^\d+$/.test(this.number);
    }
}

export interface Document {
    document_side: string;
    url: string;
    verified_at: string;
    failed_attempts: string;
}