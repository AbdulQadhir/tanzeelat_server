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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginInput = exports.AddUserResponse = exports.LoginResponse = exports.FieldError = exports.AddUserInput = exports.Location = exports.LocationInput = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
let LocationInput = class LocationInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LocationInput.prototype, "lat", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LocationInput.prototype, "lng", void 0);
LocationInput = __decorate([
    (0, type_graphql_1.InputType)()
], LocationInput);
exports.LocationInput = LocationInput;
let Location = class Location {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Location.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], Location.prototype, "coordinates", void 0);
Location = __decorate([
    (0, type_graphql_1.ObjectType)()
], Location);
exports.Location = Location;
let AddUserInput = class AddUserInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], AddUserInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AddUserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AddUserInput.prototype, "mobile", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AddUserInput.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => LocationInput, { nullable: true }),
    __metadata("design:type", LocationInput)
], AddUserInput.prototype, "location", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AddUserInput.prototype, "password", void 0);
AddUserInput = __decorate([
    (0, type_graphql_1.InputType)({ description: "New User data" })
], AddUserInput);
exports.AddUserInput = AddUserInput;
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
exports.FieldError = FieldError;
let LoginResponse = class LoginResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], LoginResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LoginResponse.prototype, "token", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LoginResponse.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LoginResponse.prototype, "city", void 0);
LoginResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], LoginResponse);
exports.LoginResponse = LoginResponse;
let AddUserResponse = class AddUserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], AddUserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AddUserResponse.prototype, "userId", void 0);
AddUserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], AddUserResponse);
exports.AddUserResponse = AddUserResponse;
let LoginInput = class LoginInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], LoginInput);
exports.LoginInput = LoginInput;
//# sourceMappingURL=user.types.js.map