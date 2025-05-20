// models/User.js
import {
  DataTypes,
  Model,
  ValidationError,
  type CreationOptional,
  type ModelDefined,
  type Optional,
} from "sequelize";
import sequelize from "../database/db.sequelize"; // Import your Sequelize instance
import {
  emailEndsWith,
  IuserAllowedRoles,
} from "../constants/config.constants";
import type { Iuser, IUserProfileType } from "../../types/users";
import type { UUID } from "node:crypto";

type UserCreationAttributes = Optional<Iuser, "id">;

class User extends Model<Iuser, UserCreationAttributes> {
  declare id: CreationOptional<number>;
  declare uniqueId: CreationOptional<UUID>;
  declare email: string;
  declare username: CreationOptional<string>;
  declare fullname: CreationOptional<string>;
  declare role: IUserProfileType;
  declare address?: CreationOptional<string>;
  declare password?: string;
}

const UserModel: ModelDefined<Iuser, UserCreationAttributes> = sequelize.define(
  "User",
  {
    // Define your model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uniqueId: {
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
    username: {
      type: DataTypes.STRING(64),
      unique: true,
    },
    fullname: {
      type: DataTypes.STRING(64),
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
      type: DataTypes.STRING(64),
    },
    password: {
      type: DataTypes.STRING(64),
    },

  }
);

export default UserModel;
