"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const room_1 = require("../../models/room");
const client_1 = require("@prisma/client");
const rooms_service_1 = require("../../libs/services/rooms.service");
const account_1 = require("../../models/account");
const typedi_1 = require("typedi");
let RoomsController = class RoomsController {
    constructor(injectedRoomsService) {
        this.injectedRoomsService = injectedRoomsService;
        this.prisma = new client_1.PrismaClient();
        this.roomsService = injectedRoomsService;
    }
    getRooms() {
        return this.roomsService.getMany();
    }
    getRoom(roomId) {
        return this.roomsService.get(roomId);
    }
    getRoomByCode(code) {
        return this.roomsService.getByCode(code);
    }
    insertRoom(roomFormValues, user) {
        roomFormValues.ownerId = user.id;
        return this.roomsService.create(roomFormValues);
    }
    startRoom(roomId) {
        const roomFormValues = new room_1.RoomFormValues();
        roomFormValues.isStarted = true;
        roomFormValues.startedAt = new Date();
        return this.roomsService.update(roomId, roomFormValues);
    }
    stopRoom(roomId) {
        const roomFormValues = new room_1.RoomFormValues();
        roomFormValues.isStarted = false;
        return this.roomsService.update(roomId, roomFormValues);
    }
    updateRoom(roomId, roomFormValues) {
        return this.roomsService.update(roomId, roomFormValues);
    }
    deleteRoom(roomId) {
        return this.roomsService.delete(roomId);
    }
};
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Authorized)(),
    (0, routing_controllers_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "getRooms", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Get)("/:roomId"),
    __param(0, (0, routing_controllers_1.Param)("roomId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "getRoom", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Get)("/code/:code"),
    __param(0, (0, routing_controllers_1.Param)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "getRoomByCode", null);
__decorate([
    (0, routing_controllers_1.Authorized)(),
    (0, routing_controllers_1.HttpCode)(201),
    (0, routing_controllers_1.Post)(),
    __param(0, (0, routing_controllers_1.Body)()),
    __param(1, (0, routing_controllers_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [room_1.RoomFormValues,
        account_1.Account]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "insertRoom", null);
__decorate([
    (0, routing_controllers_1.OnUndefined)(204),
    (0, routing_controllers_1.Patch)("/:roomId/start"),
    __param(0, (0, routing_controllers_1.Param)("roomId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "startRoom", null);
__decorate([
    (0, routing_controllers_1.OnUndefined)(204),
    (0, routing_controllers_1.Patch)("/:roomId/stop"),
    __param(0, (0, routing_controllers_1.Param)("roomId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "stopRoom", null);
__decorate([
    (0, routing_controllers_1.OnUndefined)(204),
    (0, routing_controllers_1.Put)("/:roomId"),
    __param(0, (0, routing_controllers_1.Param)("roomId")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, room_1.RoomFormValues]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "updateRoom", null);
__decorate([
    (0, routing_controllers_1.HttpCode)(200),
    (0, routing_controllers_1.Delete)("/:roomId"),
    __param(0, (0, routing_controllers_1.Param)("roomId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "deleteRoom", null);
RoomsController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/api/v1/rooms", { transformResponse: true }),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
exports.default = RoomsController;
//# sourceMappingURL=rooms.api.controller.js.map