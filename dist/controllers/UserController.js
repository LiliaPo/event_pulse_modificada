"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userModel_1 = require("../models/userModel");
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const user = yield userModel_1.UserModel.createUser(userData);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ error: `Error al registrar usuario: ${error}` });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield userModel_1.UserModel.validateLogin(email, password);
                if (!user) {
                    return res.status(401).json({ error: 'Credenciales inválidas' });
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json({ error: `Error en el login: ${error}` });
            }
        });
    }
}
exports.UserController = UserController;
