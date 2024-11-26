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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_model_1 = require("../models/user.model");
class userController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                // Verificar si el usuario ya existe
                const existingUser = yield user_model_1.userModel.findByUsername(userData.username);
                if (existingUser) {
                    return res.status(400).json({
                        error: 'El nombre de usuario ya está registrado'
                    });
                }
                const newUser = yield user_model_1.userModel.create(userData);
                res.status(201).json(newUser);
            }
            catch (error) {
                console.error('Error en registro:', error);
                res.status(500).json({ error: 'Error en el servidor' });
            }
        });
    }
    static getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier } = req.params;
                const userFound = yield user_model_1.userModel.findByIdentifier(identifier);
                if (!userFound) {
                    return res.status(404).json({
                        error: 'Usuario no encontrado'
                    });
                }
                // Excluir la contraseña de la respuesta
                const { password } = userFound, userResponse = __rest(userFound, ["password"]);
                res.json(userResponse);
            }
            catch (error) {
                console.error('Error al obtener usuario:', error);
                res.status(500).json({ error: 'Error en el servidor' });
            }
        });
    }
}
exports.userController = userController;
