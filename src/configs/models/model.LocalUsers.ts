// models/LocalUser.ts
import {
    DataTypes,
    Model,
    ValidationError,
    type CreationOptional,
    type ModelDefined,
    type Optional,
} from "sequelize";
import sequelize from "../database/db.sequelize";

import {
    emailEndsWith,
    IuserAllowedRoles,
} from "../constants/config.constants";

import type { IUserProfileType } from "../../types/users";

export interface ILocalUser {
    id?: number;
    uid?: string;
    email: string;
    password: string;
    username?: string;
    fullname: string;
    role?: IUserProfileType;
    address?: Array<string> | string | undefined;
}

export type LocalUserCreationAttributes = Optional<ILocalUser, "id" | "uid">;

class LocalUser extends Model<ILocalUser, LocalUserCreationAttributes> {
    declare id: CreationOptional<number>;
    declare uid: CreationOptional<string>;
    declare email: string;
    declare password: string;
    declare fullname: string;
    declare username?: string;
    declare role?: string;
    declare address?: string;
}

const LocalUserModel: ModelDefined<ILocalUser, LocalUserCreationAttributes> = sequelize.define(
    "LocalUser",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(64),
            unique: true,
            validate: {
                isEmail: true,
                isEndwith: (value: string) => {
                    if (!emailEndsWith.some((val) => value.endsWith(val))) {
                        throw new ValidationError(
                            "Email provided is not trusted platform",
                            []
                        );
                    }
                },
            },
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        fullname: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },

        username: {
            type: DataTypes.STRING(64),
            allowNull: true,
            unique: true,
        },
        role: {
            type: DataTypes.STRING(32),
            defaultValue: "DEFAULT",
            validate: {
                isAllowedRoles: (value: IUserProfileType) => {
                    if (!IuserAllowedRoles.includes(value)) {
                        throw new ValidationError(`Invalid User Role: ${value}`, []);
                    }
                },
            },
        },
        address: {
            type: DataTypes.STRING(128),
            allowNull: true,
        },
    }
);

export default LocalUserModel;