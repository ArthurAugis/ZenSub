
import { db } from "@/lib/db";
import { sendReminderEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const authHeader = req.headers.get('authorization');

    if (secret !== process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const subscriptions = await db.subscription.findMany({
            where: {
                status: 'Active',
            },
            include: {
                notificationRules: true,
                user: {
                    include: {
                        notificationRules: {
                            where: {
                                type: 'GLOBAL'
                            }
                        }
                    }
                }
            }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log(`[Cron Debug] Server Today: ${today.toISOString()}`);
        console.log(`[Cron Debug] Found ${subscriptions.length} active subscriptions`);

        let emailsSent = 0;

        for (const sub of subscriptions) {
            if (!sub.user.email) {
                console.log(`[Cron Debug] Skipping ${sub.name}: No user email`);
                continue;
            }

            const nextRenewal = new Date(sub.nextRenewalDate);
            console.log(`[Cron Debug] Sub: ${sub.name}, Raw NextRenewal: ${sub.nextRenewalDate}, Parsed: ${nextRenewal.toISOString()}`);

            nextRenewal.setHours(0, 0, 0, 0);

            const rules = [...sub.notificationRules, ...sub.user.notificationRules];
            console.log(`[Cron Debug] Rules found for ${sub.name}: ${rules.length}`);

            let emailSentForThisSub = false;

            for (const rule of rules) {
                if (emailSentForThisSub) break;

                const triggerDate = new Date(nextRenewal);

                switch (rule.unit) {
                    case 'Days':
                        triggerDate.setDate(triggerDate.getDate() - rule.value);
                        break;
                    case 'Weeks':
                        triggerDate.setDate(triggerDate.getDate() - (rule.value * 7));
                        break;
                    case 'Months':
                        triggerDate.setMonth(triggerDate.getMonth() - rule.value);
                        break;
                    case 'Years':
                        triggerDate.setFullYear(triggerDate.getFullYear() - rule.value);
                        break;
                }

                triggerDate.setHours(0, 0, 0, 0);

                console.log(`[Cron Debug] Checking Rule: ${rule.value} ${rule.unit} -> Trigger: ${triggerDate.toISOString()} vs Today: ${today.toISOString()}`);

                if (triggerDate.getTime() === today.getTime()) {
                    const daysLeft = `${rule.value} ${rule.unit}`;

                    await sendReminderEmail(
                        sub.user.email,
                        sub.user.name || "User",
                        sub.name,
                        daysLeft,
                        nextRenewal.toLocaleDateString(),
                        sub.price.toString(),
                        sub.currency
                    );
                    emailsSent++;
                    emailSentForThisSub = true;
                    console.log(`[Cron Debug] Email SENT to ${sub.user.email} for ${sub.name}`);
                }
            }
        }

        return NextResponse.json({ success: true, emailsSent });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
