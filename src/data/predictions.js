export const DAYS = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
export const predictionsByDay = {
    Wed: [
        { id: "w1", time: "15:00", home: "Arsenal", away: "Chelsea", tip: "Over 2.5", odds: "1.85", result: "pending" },
        { id: "w2", time: "17:30", home: "Liverpool", away: "Everton", tip: "Home Win", odds: "1.55", result: "pending" },
        { id: "w3", time: "18:00", home: "Inter", away: "Roma", tip: "BTTS", odds: "1.72", result: "pending", vip: true },
        { id: "w4", time: "20:45", home: "PSG", away: "Lyon", tip: "Home -1.5", odds: "2.10", result: "pending", vip: true },
        { id: "w5", time: "21:00", home: "Real Madrid", away: "Sevilla", tip: "Over 1.5", odds: "1.30", result: "pending" },
    ],
    Thu: [
        { id: "t1", time: "16:00", home: "Ajax", away: "PSV", tip: "Over 2.5", odds: "1.90", result: "pending" },
        { id: "t2", time: "19:00", home: "Napoli", away: "Lazio", tip: "Home Win", odds: "1.65", result: "pending", vip: true },
        { id: "t3", time: "21:00", home: "Benfica", away: "Porto", tip: "BTTS", odds: "1.80", result: "pending" },
        { id: "t4", time: "22:00", home: "Boca Jrs", away: "River", tip: "Under 2.5", odds: "1.95", result: "pending", vip: true },
    ],
    Fri: [
        { id: "f1", time: "20:00", home: "Dortmund", away: "Leipzig", tip: "Over 2.5", odds: "1.70", result: "pending" },
        { id: "f2", time: "20:30", home: "Marseille", away: "Nice", tip: "Home Win", odds: "1.80", result: "pending", vip: true },
        { id: "f3", time: "22:00", home: "Valencia", away: "Betis", tip: "Draw", odds: "3.20", result: "pending" },
    ],
    Sat: [
        { id: "s1", time: "13:30", home: "Man City", away: "Brighton", tip: "Home -1.5", odds: "1.75", result: "pending" },
        { id: "s2", time: "16:00", home: "Tottenham", away: "Fulham", tip: "Over 2.5", odds: "1.68", result: "pending", vip: true },
        { id: "s3", time: "18:30", home: "Juventus", away: "Milan", tip: "Under 2.5", odds: "1.85", result: "pending" },
        { id: "s4", time: "20:45", home: "Barcelona", away: "Atletico", tip: "BTTS", odds: "1.72", result: "pending", vip: true },
        { id: "s5", time: "22:00", home: "Bayern", away: "Stuttgart", tip: "Home Win", odds: "1.40", result: "pending" },
    ],
    Sun: [
        { id: "su1", time: "15:00", home: "Newcastle", away: "Wolves", tip: "Home Win", odds: "1.62", result: "pending" },
        { id: "su2", time: "17:30", home: "Roma", away: "Fiorentina", tip: "Over 2.5", odds: "1.90", result: "pending", vip: true },
        { id: "su3", time: "21:00", home: "Sevilla", away: "Villarreal", tip: "BTTS", odds: "1.78", result: "pending" },
    ],
    Mon: [
        { id: "m1", time: "20:00", home: "West Ham", away: "Brentford", tip: "Over 2.5", odds: "1.85", result: "pending" },
        { id: "m2", time: "21:00", home: "Genoa", away: "Torino", tip: "Under 2.5", odds: "1.80", result: "pending", vip: true },
    ],
    Tue: [
        { id: "tu1", time: "20:00", home: "Leverkusen", away: "Frankfurt", tip: "Over 2.5", odds: "1.65", result: "pending" },
        { id: "tu2", time: "21:00", home: "Atalanta", away: "Bologna", tip: "Home Win", odds: "1.70", result: "pending", vip: true },
        { id: "tu3", time: "22:00", home: "Lille", away: "Rennes", tip: "BTTS", odds: "1.75", result: "pending" },
    ],
};
export const winningHistory = [
    {
        date: "September 30, 2025",
        games: [
            { time: "20:45", home: "Real Madrid", away: "Getafe", tip: "Home -1.5", odds: "1.80", score: "3-0" },
            { time: "21:00", home: "Inter", away: "Cagliari", tip: "Over 2.5", odds: "1.65", score: "3-1" },
            { time: "22:00", home: "PSG", away: "Reims", tip: "Home Win", odds: "1.40", score: "2-0" },
        ],
    },
    {
        date: "September 29, 2025",
        games: [
            { time: "19:00", home: "Liverpool", away: "Burnley", tip: "Home Win", odds: "1.35", score: "4-0" },
            { time: "20:00", home: "Bayern", away: "Mainz", tip: "Over 2.5", odds: "1.50", score: "3-1" },
            { time: "21:00", home: "Napoli", away: "Empoli", tip: "BTTS", odds: "1.72", score: "2-1" },
            { time: "22:00", home: "Atletico", away: "Alaves", tip: "Home -1", odds: "1.85", score: "3-1" },
        ],
    },
    {
        date: "September 28, 2025",
        games: [
            { time: "16:00", home: "Arsenal", away: "Leicester", tip: "Over 2.5", odds: "1.60", score: "4-1" },
            { time: "18:30", home: "Juventus", away: "Lecce", tip: "Home Win", odds: "1.45", score: "2-0" },
            { time: "21:00", home: "Barcelona", away: "Osasuna", tip: "Home -1.5", odds: "1.70", score: "3-0" },
        ],
    },
];
export const plans = [
    {
        id: "daily",
        name: "Daily",
        price: 25,
        priceNgn: 299,
        period: "1 Day",
        durationDays: 1,
        features: ["All VIP tips for 24h", "3-5 premium picks", "Avg odds 3.0+", "Telegram access"],
    },
    {
        id: "7day",
        name: "7-Day",
        price: 85,
        priceNgn: 999,
        period: "7 Days",
        durationDays: 7,
        popular: true,
        features: ["7 days VIP access", "Daily premium picks", "Banker of the day", "Priority support", "Telegram VIP channel"],
    },
    {
        id: "30day",
        name: "30-Day",
        price: 255,
        priceNgn: 2999,
        period: "30 Days",
        durationDays: 30,
        features: ["Full month VIP", "Daily premium picks", "Banker of the day", "Priority support", "Refund guarantee"],
    },
    {
        id: "1year",
        name: "1-Year",
        price: 2125,
        priceNgn: 24999,
        period: "365 Days",
        durationDays: 365,
        features: ["Best value — save 30%", "Year-round VIP", "All premium picks", "VIP priority support", "Exclusive jackpot tips"],
    },
];
export const testimonials = [
    { name: "James M.", location: "Nairobi", text: "Hit a 5-leg accumulator on my first week. The VIP picks are unreal!" },
    { name: "Brian K.", location: "Mombasa", text: "Consistent profits for 3 months now. Best tipster in Kenya hands down." },
    { name: "Cynthia W.", location: "Kisumu", text: "Customer support is 24/7 and the bankers rarely miss. Highly recommend." },
];
export const formatKsh = (n) => `KSH ${n.toLocaleString()}`;
export const formatNgn = (n) => `₦${n.toLocaleString()}`;
export function planAmount(plan, currency) {
    return currency === "NGN" ? plan.priceNgn : plan.price;
}
export function formatPrice(plan, currency) {
    return currency === "NGN" ? formatNgn(plan.priceNgn) : formatKsh(plan.price);
}
