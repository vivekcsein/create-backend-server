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
import type { Iuser } from "../../types/users";

type UserCreationAttributes = Optional<Iuser, "id">;

class User extends Model<Iuser, UserCreationAttributes> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare role: string;
  declare password?: string;
  declare address?: string;
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
    name: {
      type: DataTypes.STRING(64),
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
    role: {
      type: DataTypes.STRING(64),
      validate: {
        isAllowedRoles: (value: string) => {
          IuserAllowedRoles.some((role) => {
            if (role !== value) {
              throw new ValidationError("Invalid User Roles", []);
            }
          });
        },
      },
    },
    password: {
      type: DataTypes.STRING(128),
    },
    address: {
      type: DataTypes.STRING(128),
    },
  }
);

export default UserModel;
