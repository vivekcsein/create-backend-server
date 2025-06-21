import {
    DataTypes, Model, type CreationOptional,
    type ModelDefined,
    // type Optional
} from "sequelize";
import sequelize from "../database/db.sequelize"; // adjust path as needed
import type { IUserProfileType } from "../../types/users";
import { IuserAllowedRoles } from "../constants/config.constants";
import { ValidationError } from "../utils/errors/errors.handler";


export interface ISocialUser {
    id?: number;
    name: string;
    email: string;
    email_verified?: Date | null;
    image?: string;
    provider: "google" | "github";
    providerId: string;
    role?: IUserProfileType;
    uid?: string;
}
export type SocialUserCreationAttributes = Omit<ISocialUser, "id" | "uniqueId">;

class SocialUser extends Model<ISocialUser, SocialUserCreationAttributes> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare email_verified?: Date | null;
    declare image?: string;
    declare provider: "google" | "github";
    declare providerId: string;
    declare role?: IUserProfileType;
    declare uid: CreationOptional<string>;
}

const SocialUserModel: ModelDefined<ISocialUser, SocialUserCreationAttributes> = sequelize.define(
    "SocialUser",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        email_verified: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        provider: {
            type: DataTypes.ENUM("google", "github"),
            allowNull: false,
        },
        providerId: {
            type: DataTypes.STRING(128),
            allowNull: false,
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
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false,
        },
    }
);

export default SocialUserModel;

