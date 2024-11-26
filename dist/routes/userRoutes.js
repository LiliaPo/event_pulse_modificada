"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
router.post('/register', UserController_1.userController.register);
router.get('/user/:identifier', UserController_1.userController.getUser);
exports.default = router;
