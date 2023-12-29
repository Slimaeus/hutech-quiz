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
exports.RoomsService = void 0;
const client_1 = require("@prisma/client");
class RoomsService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getMany() {
        return this.prisma.room.findMany();
    }
    get(id) {
        return this.prisma.room.findFirst({
            where: {
                id: id,
            },
        });
    }
    getByCode(code) {
        return this.prisma.room.findFirst({
            where: {
                code: code,
            },
        });
    }
    create(data) {
        return this.prisma.room.create({
            data: data,
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.room.update({
                where: {
                    id: id
                },
                data: data,
            });
        });
    }
    delete(id) {
        return this.prisma.room.delete({
            where: {
                id: id,
            },
        });
    }
}
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map