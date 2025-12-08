import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

    console.log("-----------------------------------------");
    console.log(`SIMULATED EMAIL TO: ${email}`);
    console.log(`LINK: ${confirmLink}`);
    console.log("-----------------------------------------");
    
    // SMTP sending (if SMTP vars are present) else console.log (for development)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
         const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: '"ZenSub" <onboarding@resend.dev>',
            to: email,
            subject: "Confirm your email",
            html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
        });
    }
};
