import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const confirmLink = `${appUrl}/new-verification?token=${token}`;

    if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: process.env.EMAIL_SERVER_PORT === "465", // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"ZenSub" <no-reply@zensub.com>',
            to: email,
            subject: "Confirm your email",
            html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
        });
    }
};

export const sendReminderEmail = async (email: string, userName: string, subscriptionName: string, daysLeft: number | string, renewalDate: string, price: string, currency: string) => {
    if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: process.env.EMAIL_SERVER_PORT === "465",
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        const subject = `Reminder: ${subscriptionName} is renewing soon`;
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Hello ${userName || 'User'},</h2>
                <p>This is a reminder that your subscription to <strong>${subscriptionName}</strong> is renewing soon.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Subscription:</strong> ${subscriptionName}</p>
                    <p style="margin: 5px 0;"><strong>Renewal Date:</strong> ${renewalDate}</p>
                    <p style="margin: 5px 0;"><strong>Amount:</strong> ${price} ${currency}</p>
                    <p style="margin: 5px 0;"><strong>Time remaining:</strong> ${daysLeft}</p>
                </div>

                <p>Login to your dashboard to manage this subscription.</p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Go to Dashboard</a>
            </div>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"ZenSub" <no-reply@zensub.com>',
            to: email,
            subject: subject,
            html: html,
        });
    }
};
