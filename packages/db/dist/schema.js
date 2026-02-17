"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlinePackages = exports.savedLocations = exports.groupMembers = exports.groups = exports.pathSegments = exports.pointsOfInterest = exports.tickets = exports.users = exports.surfaceTypeEnum = exports.crowdLevelEnum = exports.poiTypeEnum = exports.mobilityModeEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const custom_types_1 = require("./custom-types");
// ---------------------------------------------------------
// ENUMS
// ---------------------------------------------------------
exports.mobilityModeEnum = (0, pg_core_1.pgEnum)('mobility_mode', [
    'standard',
    'wheelchair',
    'reduced_mobility',
    'visual_impairment',
    'family_stroller',
]);
exports.poiTypeEnum = (0, pg_core_1.pgEnum)('poi_type', [
    'restaurant',
    'wc',
    'grandstand',
    'gate',
    'medical',
    'shop',
    'parking',
    'meetup_point',
]);
exports.crowdLevelEnum = (0, pg_core_1.pgEnum)('crowd_level', [
    'low',
    'moderate',
    'high',
    'blocked',
]);
exports.surfaceTypeEnum = (0, pg_core_1.pgEnum)('surface_type', [
    'asphalt',
    'grass',
    'gravel',
    'stairs',
    'ramp',
]);
// ---------------------------------------------------------
// TABLES
// ---------------------------------------------------------
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.varchar)('email').unique().notNull(),
    passwordHash: (0, pg_core_1.varchar)('password_hash').notNull(),
    fullName: (0, pg_core_1.varchar)('full_name'),
    mobilityMode: (0, exports.mobilityModeEnum)('mobility_mode').default('standard'),
    avoidStairs: (0, pg_core_1.boolean)('avoid_stairs').default(false),
    avoidCrowds: (0, pg_core_1.boolean)('avoid_crowds').default(false),
    avoidSlopes: (0, pg_core_1.boolean)('avoid_slopes').default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.tickets = (0, pg_core_1.pgTable)('tickets', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id).notNull(),
    code: (0, pg_core_1.varchar)('code').unique(),
    gate: (0, pg_core_1.varchar)('gate'),
    zoneName: (0, pg_core_1.varchar)('zone_name'),
    seatRow: (0, pg_core_1.varchar)('seat_row'),
    seatNumber: (0, pg_core_1.varchar)('seat_number'),
    seatLocation: (0, custom_types_1.geometry)('seat_location'), // Using point geometry
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    createdAt: (0, pg_core_1.timestamp)('created_at'),
});
exports.pointsOfInterest = (0, pg_core_1.pgTable)('points_of_interest', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    type: (0, exports.poiTypeEnum)('type').notNull(),
    location: (0, custom_types_1.geometry)('location').notNull(),
    crowdLevel: (0, exports.crowdLevelEnum)('crowd_level').default('low'),
    isWheelchairAccessible: (0, pg_core_1.boolean)('is_wheelchair_accessible').default(true),
    hasPriorityLane: (0, pg_core_1.boolean)('has_priority_lane'),
});
exports.pathSegments = (0, pg_core_1.pgTable)('path_segments', {
    id: (0, pg_core_1.integer)('id').primaryKey(), // ID is explicitly integer in DBML, not serial/increment
    startNode: (0, custom_types_1.geometry)('start_node'),
    endNode: (0, custom_types_1.geometry)('end_node'),
    surface: (0, exports.surfaceTypeEnum)('surface'),
    slopePercentage: (0, pg_core_1.doublePrecision)('slope_percentage'),
    hasStairs: (0, pg_core_1.boolean)('has_stairs'),
    crowdLevel: (0, exports.crowdLevelEnum)('crowd_level').default('low'),
});
exports.groups = (0, pg_core_1.pgTable)('groups', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name'),
    inviteCode: (0, pg_core_1.varchar)('invite_code').unique(),
    createdBy: (0, pg_core_1.integer)('created_by').references(() => exports.users.id),
    meetingPoint: (0, custom_types_1.geometry)('meeting_point'),
    createdAt: (0, pg_core_1.timestamp)('created_at'),
});
exports.groupMembers = (0, pg_core_1.pgTable)('group_members', {
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    groupId: (0, pg_core_1.integer)('group_id').references(() => exports.groups.id),
    joinedAt: (0, pg_core_1.timestamp)('joined_at'),
    lastLocation: (0, custom_types_1.geometry)('last_location'),
    lastUpdated: (0, pg_core_1.timestamp)('last_updated'),
}, (t) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [t.userId, t.groupId] }),
}));
exports.savedLocations = (0, pg_core_1.pgTable)('saved_locations', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_1.integer)('user_id').references(() => exports.users.id),
    label: (0, pg_core_1.varchar)('label'),
    location: (0, custom_types_1.geometry)('location'),
    createdAt: (0, pg_core_1.timestamp)('created_at'),
});
exports.offlinePackages = (0, pg_core_1.pgTable)('offline_packages', {
    id: (0, pg_core_1.integer)('id').primaryKey(), // Explicit integer in DBML
    regionName: (0, pg_core_1.varchar)('region_name'),
    fileUrl: (0, pg_core_1.varchar)('file_url'),
    version: (0, pg_core_1.varchar)('version'),
    sizeMb: (0, pg_core_1.doublePrecision)('size_mb'),
});
