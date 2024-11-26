"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.post('/register', user_controller_1.userController.register);
router.get('/user/:identifier', user_controller_1.userController.getUser);
exports.default = router;
