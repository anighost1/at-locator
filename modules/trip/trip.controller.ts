import { Request, Response } from "express";
import { logger } from "../../config/logger.js";
import * as tripService from "./trip.service.js";

export const createTrip = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const user: any = req.user

        const trip = await tripService.createTrip({ name, userId: user.id });

        res.status(201).json(trip);
    } catch (err: any) {
        logger.error(`Trip creation failed: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

export const getOngoingTrip = async (req: Request, res: Response) => {
    try {
        const user: any = req.user

        const trip = await tripService.getOngoingTrip({ userId: user.id });

        res.status(200).json(trip);
    } catch (err: any) {
        logger.error(`Failed to fetch ongoing trip: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
};

export const getTripList = async (req: Request, res: Response) => {
    const user: any = req.user;
    try {
        const trips = await tripService.getTripList({ userId: user.id });
        res.status(200).json(trips);
    } catch (err: any) {
        logger.error(`Failed to fetch trip list: ${err.message}`);
        res.status(400).json({ message: err.message });
    }
}