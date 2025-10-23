export class User {
    constructor(
        public readonly id: string,
        public accountType: string,
        public email: string,
        public email_verified_at?: string,
        public phone?: string,
        public phone_verified_at?: string,
        public hasPassword: boolean = false,
        public documentNumber?: string,
        public status: string = "PROSPECT",
        public statusSteps: Record<string, boolean> = {}
    ) { }

    setAccount(accountType:string) {
        if(accountType !== 'personal' && accountType !== 'business') throw new Error("Invalid account");
        this.accountType = accountType;
    }

    setEmail(email: string) {
        if (!email.includes("@")) throw new Error("Invalid email");
        this.email = email;
    }

    verifyEmail() {
        this.email_verified_at = this.formatted();
    }

    setPhone(phone: string) {
        if (!/^\+?\d{10,15}$/.test(phone)) throw new Error("Invalid phone");
        this.phone = phone;
    }

    verifyPhone() {
        this.phone_verified_at = this.formatted();
    }

    setPassword() {
        this.hasPassword = true;
    }

    setDocument(number: string) {
        this.documentNumber = number;
    }

    verifyDocument() {
        this.status = "DOC_VERIFIED";
    }

    setStatusSteps(status: Record<string, boolean>) {
        this.statusSteps = status;
    }

    private formatted() {
        const now = new Date();

        return now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0") + " " +
            String(now.getHours()).padStart(2, "0") + ":" +
            String(now.getMinutes()).padStart(2, "0") + ":" +
            String(now.getSeconds()).padStart(2, "0");
    }
}