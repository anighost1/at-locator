export interface LocationPayload {
    userId: string;
    tripId: string;
    roomId: string;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    accuracy?: number;
    recordedAt: string;
}