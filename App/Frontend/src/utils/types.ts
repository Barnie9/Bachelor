
// ---------- Backend Types ----------

export type EmotionPercentage = {
    name: string;
    percentage: number;
};

export type EmotionCategory = {
    name: string;
    percentage: number;
};

export type EmotionDayLevel = {
    date: Date;
    level: number;
};

export type User = {
    username: string;
    email: string;
    token: string;
    id?: string;
    isAdmin?: boolean;
}

export type Team = {
    id: string;
    name: string;
    employees: Employee[];
}

export type Employee = {
    id: string;
    username: string;
}

export type TimeRange = {
    startDate: Date,
    endDate: Date,
}

// ---------- Frontend Types ----------

export type Emotion = {
    name: string;
    image: string;
};

export type DayHeatmapHeader = {
    day: string;
    row: number;
};

export type MonthHeatmapHeader = {
    month: string;
    columnStart: number;
    columnEnd: number;
};

export type HeatmapCell = {
    date: Date;
    level: number;
    row: number;
    column: number;
};

export enum ViewType {
    Day = "Day",
    Week = "Week",
    Month = "Month",
};
