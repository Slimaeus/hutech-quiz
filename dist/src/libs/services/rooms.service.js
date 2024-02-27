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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsService = void 0;
const client_1 = require("@prisma/client");
const room_1 = require("../../models/room");
const typedi_1 = require("typedi");
const axios_1 = __importDefault(require("axios"));
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getMany(filter, include, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // ! Also get the owner for each room
            const rooms = yield this.prisma.room.findMany({
                where: Object.assign({}, filter),
                include: Object.assign({ quizCollection: true, currentQuiz: true }, include),
            });
            const ownerIds = rooms.map((x) => x.ownerId);
            if (ownerIds.length > 0 && token) {
                const usersResponse = yield axios_1.default.get(`${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users?${ownerIds
                    .filter((id, index, self) => self.indexOf(id) === index)
                    .filter((id) => id)
                    .map((id) => `userIds=${id}&`)
                    .join("")}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (usersResponse.status < 400 && usersResponse.data) {
                    const ownerRegistry = usersResponse.data.reduce((dict, user) => ((dict[user.id] = user), dict), {});
                    rooms.forEach((room) => {
                        const owner = ownerRegistry[room.ownerId];
                        if (owner)
                            room["owner"] = owner;
                    });
                }
                else {
                    console.error("Get data failed", usersResponse.status);
                    // throw new UnauthorizedError();
                }
            }
            return rooms;
        });
    }
    get(id, token, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.prisma.room.findFirst({
                where: {
                    id: id,
                },
                include: {
                    currentQuiz: {
                        include: {
                            answers: true,
                        },
                    },
                    quizCollection: true,
                    records: {
                        include: {
                            answer: true,
                            quiz: true,
                        },
                    },
                },
            });
            if (room.ownerId && token) {
                const ownerResponse = yield axios_1.default.get(`${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users/${room.ownerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (ownerResponse.status < 400) {
                    room["owner"] = ownerResponse.data;
                }
                else {
                    console.error("Get data failed", ownerResponse.status);
                    // throw new UnauthorizedError();
                }
                const usersResponse = yield axios_1.default.get(`${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users?${room.userIds
                    .filter((id, index, self) => self.indexOf(id) === index)
                    .filter((id) => id)
                    .map((id) => `userIds=${id}&`)
                    .join("")}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (usersResponse.status < 400) {
                    room["users"] = usersResponse.data;
                    const userRegistry = usersResponse.data.reduce((dict, user) => ((dict[user.id] = user), dict), {});
                    room.records.forEach((record) => {
                        const user = userRegistry[record.userId];
                        if (user)
                            record["user"] = user;
                    });
                }
                else {
                    console.error("Get data failed", usersResponse.status);
                    // throw new UnauthorizedError();
                }
            }
            return room;
        });
    }
    getByCode(code, token, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.prisma.room.findFirst({
                where: {
                    code: code,
                },
                include: {
                    currentQuiz: {
                        include: {
                            answers: true,
                        },
                    },
                    quizCollection: true,
                    records: {
                        include: {
                            answer: true,
                            quiz: true,
                        },
                    },
                },
            });
            if (!room)
                return null;
            if (room.ownerId && token) {
                const ownerResponse = yield axios_1.default.get(`${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users/${room.ownerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (ownerResponse.status < 400) {
                    room["owner"] = ownerResponse.data;
                }
                else {
                    console.error("Get data failed", ownerResponse.status);
                    // throw new UnauthorizedError();
                }
                const usersResponse = yield axios_1.default.get(`${process.env.HUTECH_CLASSROOM_BASE_URL}v1/Users?${room.userIds
                    .filter((id, index, self) => self.indexOf(id) === index)
                    .filter((id) => id)
                    .map((id) => `userIds=${id}&`)
                    .join("")}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (usersResponse.status < 400) {
                    room["users"] = usersResponse.data;
                    const userRegistry = usersResponse.data.reduce((dict, user) => ((dict[user.id] = user), dict), {});
                    room.records.forEach((record) => {
                        const user = userRegistry[record.userId];
                        if (user)
                            record["user"] = user;
                    });
                }
                else {
                    console.error("Get data failed", usersResponse.status);
                    // throw new UnauthorizedError();
                }
            }
            return room;
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
                    id: id,
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
    start(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.get(id);
            if (!room)
                return;
            const dataToUpdate = {
                isStarted: true,
                startedAt: new Date(),
            };
            if (room.quizCollectionId) {
                const quizzes = yield this.prisma.quizToQuizCollection.findMany({
                    where: {
                        quizCollectionId: room.quizCollectionId,
                    },
                    orderBy: {
                        id: "asc",
                    },
                });
                const currentQuizIndex = quizzes.findIndex((x) => x.quizId === room.currentQuizId);
                if (currentQuizIndex === -1 || !room.currentQuizId) {
                    const firstQuiz = quizzes[0];
                    if (firstQuiz) {
                        this.clearRecord(id);
                        dataToUpdate.currentQuizId = null;
                        dataToUpdate.currentQuizId = firstQuiz.quizId;
                    }
                }
                else {
                    const nextQuizIndex = currentQuizIndex + 1;
                    if (nextQuizIndex < quizzes.length) {
                        const nextQuiz = quizzes[nextQuizIndex];
                        dataToUpdate.currentQuizId = nextQuiz.quizId;
                    }
                    else {
                        dataToUpdate.currentQuizId = null;
                        dataToUpdate.isStarted = false;
                    }
                }
            }
            // Start the room and set the current quiz
            yield this.prisma.room.update({
                where: {
                    id: id,
                },
                data: dataToUpdate,
            });
        });
    }
    startByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.getByCode(code);
            if (!room)
                return;
            const dataToUpdate = {
                isStarted: true,
                startedAt: new Date(),
            };
            if (room.quizCollectionId) {
                const quizzes = yield this.prisma.quizToQuizCollection.findMany({
                    where: {
                        quizCollectionId: room.quizCollectionId,
                    },
                    orderBy: {
                        id: "asc",
                    },
                });
                const currentQuizIndex = quizzes.findIndex((x) => x.quizId === room.currentQuizId);
                if (currentQuizIndex === -1 || !room.currentQuizId) {
                    const firstQuiz = quizzes[0];
                    if (firstQuiz) {
                        this.clearRecord(room.id);
                        dataToUpdate.currentQuizId = null;
                        dataToUpdate.currentQuizId = firstQuiz.quizId;
                    }
                }
                else {
                    const nextQuizIndex = currentQuizIndex + 1;
                    if (nextQuizIndex < quizzes.length) {
                        const nextQuiz = quizzes[nextQuizIndex];
                        dataToUpdate.currentQuizId = nextQuiz.quizId;
                    }
                    else {
                        dataToUpdate.isStarted = false;
                    }
                }
            }
            // Start the room and set the current quiz
            yield this.prisma.room.update({
                where: {
                    code: code,
                },
                data: dataToUpdate,
            });
        });
    }
    pause(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.room.update({
                where: {
                    id: id,
                },
                data: {
                    isStarted: false,
                    // startedAt: null,
                    // currentQuizId: null,
                },
            });
        });
    }
    pauseByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.room.update({
                where: {
                    code: code,
                },
                data: {
                    isStarted: false,
                    // startedAt: null,
                    // currentQuizId: null,
                },
            });
        });
    }
    end(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.room.update({
                where: {
                    id: id,
                },
                data: {
                    isStarted: false,
                    startedAt: null,
                    currentQuizId: null,
                },
            });
        });
    }
    endByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.room.update({
                where: {
                    code: code,
                },
                data: {
                    isStarted: false,
                    startedAt: null,
                    currentQuizId: null,
                },
            });
        });
    }
    leave(roomId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.get(roomId);
            if (!room)
                return;
            const roomFormValues = room_1.RoomFormValues.toFormValues(room);
            roomFormValues.userIds = roomFormValues.userIds.filter((x) => x !== userId);
            yield this.update(room.id, roomFormValues);
        });
    }
    leaveByCode(code, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.getByCode(code);
            if (!room)
                return;
            const roomFormValues = room_1.RoomFormValues.toFormValues(room);
            roomFormValues.userIds = roomFormValues.userIds.filter((x) => x !== userId);
            yield this.update(room.id, roomFormValues);
        });
    }
    clearRecord(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.get(id);
            if (!room)
                return;
            return yield this.prisma.record.deleteMany({
                where: {
                    roomId: id,
                },
            });
        });
    }
    clearRecordByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.get(code);
            if (!room)
                return;
            return yield this.prisma.record.deleteMany({
                where: {
                    roomId: room.id,
                },
            });
        });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], RoomsService);
