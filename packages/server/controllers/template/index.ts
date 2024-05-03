import { Request, Response } from "express";

const data = {
  text: "Hello World from backend",
};

export const template = (req: Request, res: Response) => {
  try {
    return res.status(201).json({ data });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
