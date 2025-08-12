import { Request, Response, NextFunction } from "express";

function authorizeRole(...allowedRoles: ("user" | "admin")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user)) {
      return res.status(403).json({ message: "Access denied." });
    }

    next();
  };
}

export default authorizeRole;
