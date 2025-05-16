import type { FastifyRequest, FastifyReply } from "fastify";

export const errUserSignUp = (
  err: Error,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err) {
    reply
      .status(401)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        message: err.message,
      });
  }
};

export const errUserVerifyandCreateUser = (
  err: Error,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err) {
    reply
      .status(401)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        message: err.message,
      });
  }
};

export const errUserSignIn = (
  err: Error,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err) {
    reply
      .status(401)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        message: err.message,
      });
  }
};

export const errVerifyAccessTokenRoute = (
  err: Error,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err) {
    reply
      .status(401)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        message: err.message,
      });
  }
};
export const errVerifyRefreshTokenRoute = (
  err: Error,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err) {
    reply
      .status(401)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        message: err.message,
      });
  }
};

export const errUserForgetPassword = (
  err: Error,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err) {
    reply
      .status(401)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        message: err.message,
      });
  }
};

export const errResetForgetPassword = (
  err: Error,
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err) {
    reply
      .status(401)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({
        message: err.message,
      });
  }
};
