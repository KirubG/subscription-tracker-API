import { Router } from "express";
import { getUser, getUsers } from "../Controller/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/", (req, res)=>{
    // Implement logic to create user here
    res.status(201).json({ message: "User created successfully" });
});

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);

userRouter.put("/:id", (req, res)=>{
    // Implement logic to update user details here
    res.status(200).json({ message: "User details updated successfully" });
});

userRouter.delete("/:id", (req, res)=>{
    // Implement logic to delete user here
    res.status(200).json({ message: "User deleted successfully" });
});

export default userRouter;
