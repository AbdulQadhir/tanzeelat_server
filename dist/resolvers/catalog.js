"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogResolver = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const Catalog_1 = __importStar(require("../models/Catalog"));
const catalog_type_1 = require("../gqlObjectTypes/catalog.type");
const uuid_1 = require("uuid");
const mongoose_1 = require("mongoose");
const auth_1 = require("./auth");
const catalogstatus_enum_1 = require("../enums/catalogstatus.enum");
const VendorOutlet_1 = __importDefault(require("../models/VendorOutlet"));
const VendorUser_1 = __importDefault(require("../models/VendorUser"));
const sharp_1 = __importDefault(require("sharp"));
const pdf2pic_1 = require("pdf2pic");
const azure = require("azure-storage");
const blobService = azure.createBlobService("DefaultEndpointsProtocol=https;AccountName=tanzeelat;AccountKey=eVvNpa8LZFkvFuB2bDmUtfIp3+drGG9U6JOoPp2/LIEv7Mq74/VKRsJAX+pCcyB9kHv5fLm47+z4aTT0ytZrHw==;EndpointSuffix=core.windows.net");
const fs = require("fs");
const path = require("path");
const ID = "AKIAID3BSRIGM4OQ5J6A";
const SECRET = "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";
const BUCKET_NAME = "tanzeelat";
const AWS = require("aws-sdk");
let CatalogResolver = class CatalogResolver {
    constructor() {
        this.azureUpload = async (filename, fileStream, streamSize) => {
            return new Promise((resolve, reject) => {
                blobService.createBlockBlobFromStream("tanzeelat", filename, fileStream, streamSize, (error, response) => {
                    if (!error) {
                        resolve(`https://tanzeelat.blob.core.windows.net/tanzeelat/${response === null || response === void 0 ? void 0 : response.name}`);
                    }
                    else
                        reject(error);
                });
            });
        };
        this.getS3PathFromURL = async (url) => {
            return new Promise((resolve, reject) => {
                const s3 = new AWS.S3({
                    accessKeyId: ID,
                    secretAccessKey: SECRET,
                });
                var request = require("request").defaults({ encoding: null });
                request.get(url, async function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        const buffer = await (0, sharp_1.default)(Buffer.from(body))
                            .resize({ width: 200 })
                            .toBuffer();
                        const { Location } = await s3
                            .upload({
                            Bucket: BUCKET_NAME,
                            Body: buffer,
                            Key: `${(0, uuid_1.v4)()}${path.extname(url)}`,
                            ContentType: "image",
                        })
                            .promise();
                        resolve(Location);
                    }
                    else
                        reject("");
                });
            });
        };
    }
    async catalogs(vendorId, ctx) {
        if (ctx.userType == "VENDOR") {
            const vendorUser = await VendorUser_1.default.findById(ctx.userId);
            const catalogs = await Catalog_1.default.aggregate([
                {
                    $match: {
                        outlets: {
                            $in: (vendorUser === null || vendorUser === void 0 ? void 0 : vendorUser.outlets.map((el) => new mongoose_1.Types.ObjectId(el.toString()))) || [],
                        },
                    },
                },
            ]);
            return catalogs;
        }
        else {
            const access = await (0, auth_1.checkVendorAccess)(vendorId, ctx.userId);
            if (!access) {
            }
            return await Catalog_1.default.find({ vendorId });
        }
    }
    async otherCatalogsOfVendor(catalogId, state) {
        const today = new Date();
        const _tmp = await Catalog_1.default.findById(catalogId);
        const vendorId = _tmp.vendorId;
        const catalogs = await Catalog_1.default.aggregate([
            {
                $match: {
                    vendorId: new mongoose_1.Types.ObjectId(vendorId),
                    _id: {
                        $ne: new mongoose_1.Types.ObjectId(catalogId),
                    },
                    status: "ACCEPTED",
                    expiry: { $gte: today },
                    startDate: { $lte: today },
                    enabled: true,
                    pdf: { $exists: true },
                },
            },
            {
                $lookup: {
                    from: "vendoroutlets",
                    localField: "outlets",
                    foreignField: "_id",
                    as: "outlets",
                },
            },
            {
                $match: {
                    "outlets.state": state,
                },
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $unwind: {
                    path: "$vendor",
                },
            },
        ]);
        return catalogs;
    }
    async activeCatalogs(filter, state) {
        var _a, _b;
        let filters = {};
        if ((((_a = filter.vendorId) === null || _a === void 0 ? void 0 : _a.filter((el) => el != "").length) || 0) > 0)
            filters["vendor._id"] = {
                $in: ((_b = filter.vendorId) === null || _b === void 0 ? void 0 : _b.filter((el) => el != "").map((el) => new mongoose_1.Types.ObjectId(el))) || [],
            };
        if (filter === null || filter === void 0 ? void 0 : filter.category)
            filters.catalogCategoryId = new mongoose_1.Types.ObjectId(filter.category);
        if (filter === null || filter === void 0 ? void 0 : filter.search)
            filters["$or"] = [
                { title: { $regex: filter.search, $options: "i" } },
                { "outlet.name": { $regex: filter.search, $options: "i" } },
                { "outlet.namear": { $regex: filter.search, $options: "i" } },
                { "outlet.state": { $regex: filter.search, $options: "i" } },
            ];
        if (filter === null || filter === void 0 ? void 0 : filter.state)
            filters["outlet.state"] = filter.state;
        const today = new Date();
        const catalogs = await Catalog_1.default.aggregate([
            {
                $match: {
                    status: "ACCEPTED",
                    startDate: { $lte: today },
                    enabled: true,
                },
            },
            {
                $project: {
                    vendorId: 1,
                    title: 1,
                    titlear: 1,
                    outlets: 1,
                    pages: 1,
                    thumbnails: 1,
                    outletCopy: "$outlets",
                    catalogCategoryId: 1,
                    catalogId: "$_id",
                    expiry: 1,
                    startDate: 1,
                    status: 1,
                    pdf: 1,
                    endDate: {
                        $add: [
                            {
                                $dateFromString: {
                                    dateString: {
                                        $dateToString: { format: "%Y-%m-%d", date: "$expiry" },
                                    },
                                },
                            },
                            1 * 24 * 60 * 60000,
                        ],
                    },
                },
            },
            {
                $match: {
                    endDate: { $gte: today },
                    pdf: { $exists: true },
                },
            },
            {
                $lookup: {
                    from: "vendoroutlets",
                    localField: "outlets",
                    foreignField: "_id",
                    as: "outlets",
                },
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $unwind: {
                    path: "$vendor",
                },
            },
            {
                $unwind: {
                    path: "$outletCopy",
                },
            },
            {
                $lookup: {
                    from: "vendoroutlets",
                    localField: "outletCopy",
                    foreignField: "_id",
                    as: "outlet",
                },
            },
            {
                $unwind: {
                    path: "$outlet",
                },
            },
            {
                $sort: {
                    "vendor.grade": 1,
                },
            },
            {
                $match: {
                    "vendor.active": true,
                    ...filters,
                },
            },
            {
                $group: {
                    _id: {
                        state: "$outlet.state",
                        catalogId: "$catalogId",
                    },
                    catalogId: { $first: "$catalogId" },
                    state: { $first: "$outlet.state" },
                    catalogs: {
                        $first: {
                            _id: "$catalogId",
                            id: "$catalogId",
                            catalogCategoryId: "$catalogCategoryId",
                            title: "$title",
                            titlear: "$titlear",
                            outletName: "$outlet.name",
                            outlet: {
                                name: "$outlet.name",
                                namear: "$outlet.namear",
                                state: "$outlet.state",
                                place: "$outlet.place",
                            },
                            vendor: {
                                _id: "$vendor._id",
                                logo: "$vendor.logo",
                                shopname: "$vendor.shopname",
                            },
                            pages: "$pages",
                            thumbnails: "$thumbnails",
                            outlets: "$outlets",
                            expiry: "$expiry",
                            pdf: "$pdf",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$state",
                    state: {
                        $first: "$state",
                    },
                    catalogs: {
                        $push: "$catalogs",
                    },
                },
            },
        ]);
        catalogs.sort(function (x, y) {
            return x.state == state ? -1 : y.state == state ? 1 : 0;
        });
        return catalogs;
    }
    async activeCatalogsOfVendor(ctx) {
        const user = await VendorUser_1.default.findById(ctx.userId);
        const catalogs = await Catalog_1.default.aggregate([
            {
                $match: {
                    vendorId: new mongoose_1.Types.ObjectId(user.vendorId),
                    status: "ACCEPTED",
                    enabled: true,
                },
            },
            {
                $sort: {
                    _id: -1,
                },
            },
        ]);
        return catalogs;
    }
    async bookmarkedCatalogs(bookmarks) {
        var _a;
        const _bookmarks = (_a = bookmarks === null || bookmarks === void 0 ? void 0 : bookmarks.bookmarks) === null || _a === void 0 ? void 0 : _a.map((el) => new mongoose_1.Types.ObjectId(el.toString()));
        const today = new Date();
        console.log(_bookmarks);
        const catalogs = await Catalog_1.default.aggregate([
            {
                $match: {
                    status: "ACCEPTED",
                    expiry: { $gte: today },
                    startDate: { $lte: today },
                    _id: { $in: _bookmarks },
                    pdf: { $exists: true },
                },
            },
            {
                $project: {
                    vendorId: 1,
                    title: 1,
                    titlear: 1,
                    outlets: 1,
                    pages: 1,
                    pdf: 1,
                    thumbnails: 1,
                    outletCopy: "$outlets",
                    catalogCategoryId: 1,
                    catalogId: "$_id",
                    expiry: 1,
                    startDate: 1,
                    status: 1,
                },
            },
            {
                $lookup: {
                    from: "vendoroutlets",
                    localField: "outlets",
                    foreignField: "_id",
                    as: "outlets",
                },
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $unwind: {
                    path: "$vendor",
                },
            },
            {
                $project: {
                    _id: "$catalogId",
                    id: "$catalogId",
                    catalogCategoryId: "$catalogCategoryId",
                    title: "$title",
                    titlear: "$titlear",
                    outletName: { $first: "$outlets.name" },
                    outlet: {
                        name: { $first: "$outlets.name" },
                        namear: { $first: "$outlets.namear" },
                        state: { $first: "$outlets.state" },
                        place: { $first: "$outlets.place" },
                    },
                    vendor: {
                        _id: "$vendor._id",
                        logo: "$vendor.logo",
                        shopname: "$vendor.shopname",
                    },
                    pages: "$pages",
                    pdf: "$pdf",
                    thumbnails: "$thumbnails",
                    outlets: "$outlets",
                    expiry: "$expiry",
                },
            },
        ]);
        return catalogs;
    }
    async nearCatalogs(coords) {
        let _coords = [
            parseFloat(coords.split(",")[0] || "") || 0,
            parseFloat(coords.split(",")[1] || "") || 0,
        ];
        const today = new Date();
        const catalogs = await VendorOutlet_1.default.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: _coords,
                    },
                    distanceField: "distance",
                    spherical: true,
                },
            },
            {
                $lookup: {
                    from: "catalogs",
                    localField: "_id",
                    foreignField: "outlets",
                    as: "catalogs",
                },
            },
            {
                $unwind: {
                    path: "$catalogs",
                },
            },
            {
                $match: {
                    "catalogs.status": "ACCEPTED",
                    "catalogs.startDate": { $lte: today },
                    "catalogs.expiry": { $gte: today },
                    "catalogs.pdf": { $exists: true },
                },
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $unwind: {
                    path: "$vendor",
                },
            },
            {
                $match: {
                    "vendor.active": true,
                },
            },
            {
                $lookup: {
                    from: "vendoroutlets",
                    localField: "catalogs.outlets",
                    foreignField: "_id",
                    as: "outlets",
                },
            },
            {
                $project: {
                    _id: "$catalogs._id",
                    id: "$catalogs._id",
                    title: "$catalogs.title",
                    titlear: "$catalogs.titlear",
                    expiry: "$catalogs.expiry",
                    status: "$catalogs.status",
                    startDate: "$catalogs.startDate",
                    pages: "$catalogs.pages",
                    pdf: "$catalogs.pdf",
                    thumbnails: "$catalogs.thumbnails",
                    "vendor._id": 1,
                    "vendor.shopname": 1,
                    "vendor.logo": 1,
                    "vendor.outlets": 1,
                    "vendor.active": 1,
                    outlet: {
                        name: "$name",
                        state: "$state",
                        place: "$place",
                        location: "$location",
                        distance: "$distance",
                    },
                    outlets: "$outlets",
                },
            },
            {
                $group: {
                    _id: "$id",
                    id: { $first: "$id" },
                    title: {
                        $first: "$title",
                    },
                    titlear: {
                        $first: "$titlear",
                    },
                    expiry: {
                        $first: "$expiry",
                    },
                    status: {
                        $first: "$status",
                    },
                    startDate: {
                        $first: "$startDate",
                    },
                    pages: {
                        $first: "$pages",
                    },
                    pdf: {
                        $first: "$pdf",
                    },
                    thumbnails: {
                        $first: "$thumbnails",
                    },
                    vendor: {
                        $first: {
                            _id: "$vendor._id",
                            shopname: "$vendor.shopname",
                            logo: "$vendor.logo",
                            active: "$vendor.active",
                        },
                    },
                    outlet: {
                        $first: {
                            name: "$outlet.name",
                            state: "$outlet.state",
                            place: "$outlet.place",
                            location: "$outlet.location",
                            distance: "$outlet.distance",
                        },
                    },
                    outlets: {
                        $first: "$outlets",
                    },
                },
            },
            {
                $sort: {
                    "outlet.distance": 1,
                },
            },
            {
                $limit: 10,
            },
        ]);
        return catalogs;
    }
    async catalogDt(id) {
        const catalogs = await Catalog_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "vendoroutlets",
                    localField: "outlets",
                    foreignField: "_id",
                    as: "outlets",
                },
            },
            {
                $lookup: {
                    from: "catalogcategories",
                    localField: "catalogCategoryId",
                    foreignField: "_id",
                    as: "catalogCategoryDt",
                },
            },
            {
                $unwind: {
                    path: "$catalogCategoryDt",
                },
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor",
                },
            },
            {
                $unwind: {
                    path: "$vendor",
                },
            },
        ]);
        return catalogs.length > 0 && catalogs[0];
    }
    async catalogRequests() {
        return await Catalog_1.default.find({ status: catalogstatus_enum_1.CatalogStatus.PENDING }, "id title vendorId startDate").populate("vendorId", "id shopname");
    }
    async catalogAction(id, action) {
        const status = action == "approve" ? catalogstatus_enum_1.CatalogStatus.ACCEPTED : catalogstatus_enum_1.CatalogStatus.REJECTED;
        const result = await Catalog_1.default.findByIdAndUpdate(id, {
            $set: {
                status,
            },
        });
        return result ? true : false;
    }
    async updCatalogEnabled(catalogId, enabled) {
        console.log(enabled);
        await Catalog_1.default.findByIdAndUpdate(catalogId, {
            $set: {
                enabled,
            },
        });
        return true;
    }
    async updCatalogExpDate(catalogId, expiry) {
        await Catalog_1.default.findByIdAndUpdate(catalogId, {
            $set: {
                expiry,
            },
        });
        return true;
    }
    async addCatalog2(input, ctx) {
        const { createReadStream, filename } = await (input === null || input === void 0 ? void 0 : input.pdf);
        let streamSize = parseInt(ctx.content_length);
        const fileStream = createReadStream();
        const _filename = `${(0, uuid_1.v4)()}${path.extname(filename)}`;
        const resp = await this.azureUpload(_filename, fileStream, streamSize);
        console.log(resp);
        return true;
    }
    async addCatalog(input, ctx) {
        const { createReadStream, filename } = await (input === null || input === void 0 ? void 0 : input.pdf);
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        const fileStream = createReadStream();
        let streamSize = parseInt(ctx.content_length);
        const pdfLocation = await this.azureUpload(`${(0, uuid_1.v4)()}${path.extname(filename)}`, fileStream, streamSize);
        const stream = createReadStream();
        const pathObj = await storeFS(stream, filename);
        const options = {
            density: 100,
            saveFilename: "untitled",
            savePath: "/tmp/tan_pdf",
            format: "png",
            width: 200,
            height: 270,
        };
        const convert = (0, pdf2pic_1.fromPath)(pathObj.path, options);
        let imgs = [];
        if (convert.bulk)
            imgs = await convert.bulk(-1);
        let thumbs = [];
        for (const img of imgs) {
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: fs.readFileSync(img.path),
                Key: `${(0, uuid_1.v4)()}.png`,
            })
                .promise();
            console.log(Location);
            thumbs.push(Location);
        }
        const user = new Catalog_1.default({
            ...input,
            pdf: pdfLocation,
            thumbnails: thumbs,
        });
        const result = await user.save();
        return result;
    }
    async genThumbnails(id) {
        const catalog = await Catalog_1.default.findById(id);
        if (!catalog)
            return false;
        var images = [];
        for (const page of catalog.pages) {
            const img = await this.getS3PathFromURL(page);
            images.push(img);
        }
        await Catalog_1.default.findByIdAndUpdate(id, {
            $set: {
                thumbnails: images,
            },
        });
        return true;
    }
    async updCatalogPages(pages) {
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        let catalog = await Catalog_1.default.findById(pages.catalogId);
        let _pages = [...catalog.pages];
        if (!catalog)
            return { result: false };
        let i = 0;
        for (const file of pages === null || pages === void 0 ? void 0 : pages.files) {
            if (file.newImg) {
                const { createReadStream, filename, mimetype } = await (file === null || file === void 0 ? void 0 : file.newImg);
                const { Location } = await s3
                    .upload({
                    Bucket: BUCKET_NAME,
                    Body: createReadStream(),
                    Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
                    ContentType: mimetype,
                })
                    .promise();
                if (file.oldImg)
                    try {
                        await s3
                            .deleteObject({
                            Bucket: BUCKET_NAME,
                            Key: file.oldImg.split("/").pop(),
                        })
                            .promise();
                        console.log("file deleted Successfully");
                    }
                    catch (err) {
                        console.log("ERROR in file Deleting : " + JSON.stringify(err));
                    }
                console.log(Location);
                _pages[i] = Location;
            }
            i++;
        }
        await Catalog_1.default.findByIdAndUpdate(pages.catalogId, {
            $set: {
                pages: _pages,
                status: catalogstatus_enum_1.CatalogStatus.PENDING,
            },
        });
        return { result: true };
    }
    async updCatalogPdf(pages) {
        let catalog = await Catalog_1.default.findById(pages.catalogId);
        let _pdf = "";
        let oldPdf = catalog.pdf;
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        if (!catalog) {
            return { result: false };
        }
        const { createReadStream, filename, mimetype } = await (pages === null || pages === void 0 ? void 0 : pages.pdf);
        const { Location } = await s3
            .upload({
            Bucket: BUCKET_NAME,
            Body: createReadStream(),
            Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
            ContentType: mimetype,
        })
            .promise();
        if (oldPdf)
            try {
                await s3
                    .deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: oldPdf.split("/").pop(),
                })
                    .promise();
                console.log("file deleted Successfully");
            }
            catch (err) {
                console.log("ERROR in file Deleting : " + JSON.stringify(err));
            }
        const stream = createReadStream();
        const pathObj = await storeFS(stream, filename);
        const options = {
            density: 100,
            saveFilename: "untitled",
            savePath: "/tmp/tan_pdf",
            format: "png",
            width: 200,
        };
        const convert = (0, pdf2pic_1.fromPath)(pathObj.path, options);
        let imgs = [];
        if (convert.bulk)
            imgs = await convert.bulk(-1);
        let thumbs = [];
        for (const img of imgs) {
            const { Location } = await s3
                .upload({
                Bucket: BUCKET_NAME,
                Body: fs.readFileSync(img.path),
                Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
            })
                .promise();
            console.log(Location);
            thumbs.push(Location);
        }
        _pdf = Location;
        await Catalog_1.default.findByIdAndUpdate(pages.catalogId, {
            $set: {
                pdf: _pdf,
                thumbnails: thumbs,
                status: catalogstatus_enum_1.CatalogStatus.PENDING,
            },
        });
        return { result: true };
    }
    async updCatalogPdf2(pages) {
        const s3 = new AWS.S3({
            accessKeyId: ID,
            secretAccessKey: SECRET,
        });
        let catalog = await Catalog_1.default.findById(pages.catalogId);
        let _pdf = "";
        let oldPdf = catalog.pdf;
        if (!catalog) {
            return { result: false };
        }
        const { createReadStream, filename, mimetype } = await (pages === null || pages === void 0 ? void 0 : pages.pdf);
        const { Location } = await s3
            .upload({
            Bucket: BUCKET_NAME,
            Body: createReadStream(),
            Key: `${(0, uuid_1.v4)()}${path.extname(filename)}`,
            ContentType: mimetype,
        })
            .promise();
        if (oldPdf)
            try {
                await s3
                    .deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: oldPdf.split("/").pop(),
                })
                    .promise();
                console.log("file deleted Successfully");
            }
            catch (err) {
                console.log("ERROR in file Deleting : " + JSON.stringify(err));
            }
        console.log(Location);
        _pdf = Location;
        await Catalog_1.default.findByIdAndUpdate(pages.catalogId, {
            $set: {
                pdf: _pdf,
                status: catalogstatus_enum_1.CatalogStatus.PENDING,
            },
        });
        return { result: true };
    }
    async testPdf() {
        var PDFImage = require("pdf-image").PDFImage;
        var pdfImage = new PDFImage("https://tanzeelat.s3.us-east-2.amazonaws.com/ab8a367c-0690-4140-bf4f-3030e2ce9dae.pdf");
        const imgPaths = await pdfImage.convertFile();
        console.log(imgPaths);
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Catalog_1.Catalog]),
    __param(0, (0, type_graphql_1.Arg)("vendorId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "catalogs", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Catalog_1.Catalog]),
    __param(0, (0, type_graphql_1.Arg)("catalogId")),
    __param(1, (0, type_graphql_1.Arg)("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "otherCatalogsOfVendor", null);
__decorate([
    (0, type_graphql_1.Query)(() => [catalog_type_1.ActiveCatalogOutput]),
    __param(0, (0, type_graphql_1.Arg)("filter")),
    __param(1, (0, type_graphql_1.Arg)("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_type_1.CatalogFilters, String]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "activeCatalogs", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Catalog_1.Catalog]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "activeCatalogsOfVendor", null);
__decorate([
    (0, type_graphql_1.Query)(() => [catalog_type_1.CatalogOutput]),
    __param(0, (0, type_graphql_1.Arg)("bookmarks")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_type_1.BookmarkInput]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "bookmarkedCatalogs", null);
__decorate([
    (0, type_graphql_1.Query)(() => [catalog_type_1.CatalogOutput]),
    __param(0, (0, type_graphql_1.Arg)("coords")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "nearCatalogs", null);
__decorate([
    (0, type_graphql_1.Query)(() => Catalog_1.Catalog),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "catalogDt", null);
__decorate([
    (0, type_graphql_1.Query)(() => [catalog_type_1.CatalogOutput]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "catalogRequests", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("action")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "catalogAction", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("catalogId")),
    __param(1, (0, type_graphql_1.Arg)("enabled")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "updCatalogEnabled", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("catalogId")),
    __param(1, (0, type_graphql_1.Arg)("expiry")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "updCatalogExpDate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_type_1.CatalogInput, Object]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "addCatalog2", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Catalog_1.Catalog),
    __param(0, (0, type_graphql_1.Arg)("input")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_type_1.CatalogInput, Object]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "addCatalog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "genThumbnails", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => catalog_type_1.UploadRespType),
    __param(0, (0, type_graphql_1.Arg)("pages", () => catalog_type_1.UpdPagesInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_type_1.UpdPagesInput]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "updCatalogPages", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => catalog_type_1.UploadRespType),
    __param(0, (0, type_graphql_1.Arg)("pages", () => catalog_type_1.UpdPdfInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_type_1.UpdPdfInput]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "updCatalogPdf", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => catalog_type_1.UploadRespType),
    __param(0, (0, type_graphql_1.Arg)("pages", () => catalog_type_1.UpdPdfInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [catalog_type_1.UpdPdfInput]),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "updCatalogPdf2", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogResolver.prototype, "testPdf", null);
CatalogResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CatalogResolver);
exports.CatalogResolver = CatalogResolver;
const storeFS = (stream, filename) => {
    const uploadDir = "/tmp";
    const path = `${uploadDir}/${filename}`;
    return new Promise((resolve, reject) => stream
        .on("error", (error) => {
        if (stream.truncated)
            fs.unlinkSync(path);
        reject(error);
    })
        .pipe(fs.createWriteStream(path))
        .on("error", (error) => reject(error))
        .on("finish", () => resolve({ path })));
};
//# sourceMappingURL=catalog.js.map